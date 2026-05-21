import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto, UpdateSkillsDto, UpdateInterestsDto } from './dto/update-profile.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Put(':id/profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateProfile(id, user.sub, user.role, dto);
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'Get user projects/initiatives' })
  async getProjects(@Param('id') id: string) {
    return this.usersService.getProjects(id);
  }

  @Get(':id/contributions')
  @ApiOperation({ summary: 'Get user contributions' })
  async getContributions(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getContributions(id, page, limit);
  }

  @Put(':id/skills')
  @ApiOperation({ summary: 'Update user skills' })
  async updateSkills(
    @Param('id') id: string,
    @Body() dto: UpdateSkillsDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateSkills(id, user.sub, user.role, dto);
  }

  @Put(':id/interests')
  @ApiOperation({ summary: 'Update user interests' })
  async updateInterests(
    @Param('id') id: string,
    @Body() dto: UpdateInterestsDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateInterests(id, user.sub, user.role, dto);
  }
}
