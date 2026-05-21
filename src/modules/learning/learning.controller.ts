import {
  Controller,
  Get,
  Post,
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
import { LearningService } from './learning.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Learning')
@ApiBearerAuth('JWT-auth')
@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('courses')
  @ApiOperation({ summary: 'List courses' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCourses(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.learningService.getCourses({ category, search, page, limit });
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get course detail' })
  async getCourseById(@Param('id') id: string) {
    return this.learningService.getCourseById(id);
  }

  @Get('workshops')
  @ApiOperation({ summary: 'List workshop sessions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWorkshops(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.learningService.getWorkshops(page, limit);
  }

  @Post('workshops/:id/register')
  @ApiOperation({ summary: 'Register for workshop session' })
  async registerForWorkshop(@Param('id') id: string, @CurrentUser() user: any) {
    return this.learningService.registerForWorkshop(id, user.sub);
  }

  @Get('my-progress')
  @ApiOperation({ summary: 'Get my learning progress' })
  async getMyProgress(@CurrentUser() user: any) {
    return this.learningService.getMyProgress(user.sub);
  }
}
