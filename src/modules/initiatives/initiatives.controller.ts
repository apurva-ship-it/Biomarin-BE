import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateInitiativeDto,
  CreateInitiativeUpdateDto,
  ToggleObjectiveDto,
} from './dto/create-initiative.dto';

@ApiTags('Initiatives')
@ApiBearerAuth('JWT-auth')
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Get()
  @ApiOperation({ summary: 'List initiatives with filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'team', required: false })
  @ApiQuery({ name: 'technology', required: false })
  @ApiQuery({ name: 'impact', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('search') search?: string,
    @Query('team') team?: string,
    @Query('technology') technology?: string,
    @Query('impact') impact?: string,
    @Query('category') category?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.initiativesService.findAll({ search, team, technology, impact, category, page, limit });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get initiative categories' })
  async getCategories() {
    return this.initiativesService.getCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get initiative by slug' })
  async findBySlug(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.initiativesService.findBySlug(slug, user?.sub);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('author', 'admin')
  @ApiOperation({ summary: 'Create a new initiative (author/admin only)' })
  async create(@Body() dto: CreateInitiativeDto, @CurrentUser() user: any) {
    return this.initiativesService.create(dto, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update initiative' })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateInitiativeDto,
    @CurrentUser() user: any,
  ) {
    return this.initiativesService.update(id, dto, user.sub, user.role);
  }

  @Get(':id/objectives')
  @ApiOperation({ summary: 'Get initiative objectives' })
  async getObjectives(@Param('id') id: string) {
    return this.initiativesService.getObjectives(id);
  }

  @Patch(':id/objectives/:objId')
  @ApiOperation({ summary: 'Toggle objective completion' })
  async toggleObjective(
    @Param('id') id: string,
    @Param('objId') objId: string,
    @Body() dto: ToggleObjectiveDto,
    @CurrentUser() user: any,
  ) {
    return this.initiativesService.toggleObjective(id, objId, dto, user.sub);
  }

  @Get(':id/updates')
  @ApiOperation({ summary: 'Get initiative timeline updates' })
  async getUpdates(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.initiativesService.getUpdates(id, page, limit);
  }

  @Post(':id/updates')
  @ApiOperation({ summary: 'Post initiative update' })
  async createUpdate(
    @Param('id') id: string,
    @Body() dto: CreateInitiativeUpdateDto,
    @CurrentUser() user: any,
  ) {
    return this.initiativesService.createUpdate(id, dto, user.sub);
  }

  @Post(':id/save')
  @ApiOperation({ summary: 'Save/bookmark an initiative' })
  async toggleSave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.initiativesService.toggleSave(id, user.sub);
  }
}
