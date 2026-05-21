import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(query: { page?: number; limit?: number; search?: string; role?: string }) {
    const { page = 1, limit = 20, search, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { department: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          title: true,
          department: true,
          location: true,
          avatarUrl: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserRole(
    id: string,
    newRole: string,
    requestingUserId: string,
  ) {
    if (!['admin', 'author', 'viewer'].includes(newRole)) {
      throw new ForbiddenException('Invalid role specified');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });
  }

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalInitiatives,
      activeInitiatives,
      totalResources,
      totalTools,
      totalCourses,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.initiative.count(),
      this.prisma.initiative.count({ where: { status: 'active' } }),
      this.prisma.resource.count({ where: { deletedAt: null } }),
      this.prisma.tool.count(),
      this.prisma.course.count({ where: { isPublished: true } }),
    ]);

    const roleBreakdown = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const topTools = await this.prisma.tool.findMany({
      orderBy: { usageCount: 'desc' },
      take: 5,
      select: { id: true, name: true, category: true, usageCount: true },
    });

    const recentUsers = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      overview: {
        totalUsers,
        activeUsers,
        totalInitiatives,
        activeInitiatives,
        totalResources,
        totalTools,
        totalCourses,
      },
      roleBreakdown: roleBreakdown.map((r) => ({
        role: r.role,
        count: r._count.role,
      })),
      topTools,
      recentUsers,
    };
  }

  async getAccessRequests() {
    // Return mock access request data since we don't have a table for it
    return {
      data: [],
      meta: { total: 0, pending: 0 },
    };
  }

  async updateUserStatus(id: string, status: string) {
    if (!['active', 'inactive', 'pending'].includes(status)) {
      throw new ForbiddenException('Invalid status');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, status: true, role: true },
    });
  }
}
