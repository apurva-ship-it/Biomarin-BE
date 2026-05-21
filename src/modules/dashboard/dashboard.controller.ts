import {
  Controller,
  Get,
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
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('welcome')
  @ApiOperation({ summary: 'Get welcome dashboard data for current user' })
  async getWelcome(@CurrentUser() user: any) {
    return this.dashboardService.getWelcome(user.sub);
  }

  @Get('announcements')
  @ApiOperation({ summary: 'Get latest announcements' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAnnouncements(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getAnnouncements(page, limit);
  }

  @Get('trending-tools')
  @ApiOperation({ summary: 'Get trending tools' })
  async getTrendingTools() {
    return this.dashboardService.getTrendingTools();
  }

  @Get('pinned-resources')
  @ApiOperation({ summary: 'Get current user pinned resources' })
  async getPinnedResources(@CurrentUser() user: any) {
    return this.dashboardService.getPinnedResources(user.sub);
  }

  @Get('learning-path')
  @ApiOperation({ summary: 'Get current user learning path' })
  async getLearningPath(@CurrentUser() user: any) {
    return this.dashboardService.getLearningPath(user.sub);
  }

  @Get('north-star')
  @ApiOperation({ summary: 'Get North Star Vision banner content' })
  async getNorthStar() {
    return this.dashboardService.getNorthStar();
  }
}
