import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExpertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    domain?: string;
    team?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, domain, team, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { title: { contains: search } },
        { department: { contains: search } },
        { skills: { some: { skill: { contains: search } } } },
      ];
    }

    if (domain) {
      where.skills = {
        some: { skill: { contains: domain } },
      };
    }

    if (team) {
      where.department = { contains: team };
    }

    const [experts, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          title: true,
          department: true,
          location: true,
          avatarUrl: true,
          availabilityStatus: true,
          email: true,
          teamsHandle: true,
          skills: true,
          interests: true,
          orgLevel: true,
        },
        orderBy: { firstName: 'asc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: experts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        interests: true,
        tools: true,
        projects: {
          where: { isActive: true },
          include: {
            initiative: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
              },
            },
          },
        },
        contributions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        reportsTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            avatarUrl: true,
          },
        },
        directReports: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            avatarUrl: true,
            department: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Expert not found');
    }

    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }

  async getOrgChart(rootUserId?: string) {
    // Get all users with their hierarchy info
    const users = await this.prisma.user.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        avatarUrl: true,
        department: true,
        reportsToId: true,
        orgLevel: true,
        directReports: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            avatarUrl: true,
            orgLevel: true,
            reportsToId: true,
          },
        },
      },
      orderBy: { orgLevel: 'asc' },
    });

    // Build tree structure
    const buildTree = (parentId: string | null, level: number): any[] => {
      return users
        .filter((u) => u.reportsToId === parentId)
        .map((u) => ({
          ...u,
          children: buildTree(u.id, level + 1),
        }));
    };

    // Find root (CEO - no reportsToId)
    const roots = users.filter((u) => !u.reportsToId);

    if (rootUserId) {
      const rootUser = users.find((u) => u.id === rootUserId);
      if (!rootUser) {
        throw new NotFoundException('User not found');
      }
      return {
        root: { ...rootUser, children: buildTree(rootUserId, 1) },
        totalUsers: users.length,
      };
    }

    return {
      root: roots.length > 0
        ? { ...roots[0], children: buildTree(roots[0].id, 1) }
        : null,
      totalUsers: users.length,
    };
  }
}
