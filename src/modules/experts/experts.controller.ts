import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExpertsService } from './experts.service';

@ApiTags('Experts')
@ApiBearerAuth('JWT-auth')
@Controller('experts')
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get()
  @ApiOperation({ summary: 'List experts with filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'domain', required: false })
  @ApiQuery({ name: 'team', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('search') search?: string,
    @Query('domain') domain?: string,
    @Query('team') team?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.expertsService.findAll({ search, domain, team, page, limit });
  }

  @Get('org-chart')
  @ApiOperation({ summary: 'Get org chart hierarchy' })
  @ApiQuery({ name: 'root_user_id', required: false })
  async getOrgChart(@Query('root_user_id') rootUserId?: string) {
    return this.expertsService.getOrgChart(rootUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expert profile by ID' })
  async findById(@Param('id') id: string) {
    return this.expertsService.findById(id);
  }
}
