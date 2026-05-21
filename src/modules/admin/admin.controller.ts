import {
  Controller,
  Get,
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
import { AdminService } from './admin.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({ page, limit, search, role });
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role (admin only)' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateUserRole(id, body.role, user.sub);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (admin only)' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.adminService.updateUserStatus(id, body.status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics (admin only)' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('access-requests')
  @ApiOperation({ summary: 'Get pending access requests (admin only)' })
  async getAccessRequests() {
    return this.adminService.getAccessRequests();
  }
}
