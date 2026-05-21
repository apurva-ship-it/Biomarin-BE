import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { ResourcesService } from './resources.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateResourceDto } from './dto/resource.dto';

@ApiTags('Resources')
@ApiBearerAuth('JWT-auth')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @ApiOperation({ summary: 'List resources' })
  @ApiQuery({ name: 'tags', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('tags') tags?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.resourcesService.findAll({ tags, type, search, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  async findById(@Param('id') id: string) {
    return this.resourcesService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('author', 'admin')
  @ApiOperation({ summary: 'Create resource (author/admin)' })
  async create(@Body() dto: CreateResourceDto, @CurrentUser() user: any) {
    return this.resourcesService.create(dto, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update resource' })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateResourceDto,
    @CurrentUser() user: any,
  ) {
    return this.resourcesService.update(id, dto, user.sub, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource (soft delete)' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resourcesService.delete(id, user.sub, user.role);
  }

  @Post(':id/pin')
  @ApiOperation({ summary: 'Pin/unpin resource' })
  async togglePin(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resourcesService.togglePin(id, user.sub);
  }
}
