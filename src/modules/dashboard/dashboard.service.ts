import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getWelcome(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        title: true,
        department: true,
        avatarUrl: true,
        lastLoginAt: true,
      },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return {
      user,
      unreadNotifications: unreadCount,
      currentDate: new Date().toISOString(),
    };
  }

  async getAnnouncements(page = 1, limit = 6) {
    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        where: { publishedAt: { not: null } },
      }),
      this.prisma.announcement.count({ where: { publishedAt: { not: null } } }),
    ]);

    return {
      data: announcements,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTrendingTools() {
    const tools = await this.prisma.tool.findMany({
      where: { isTrending: true },
      orderBy: { usageCount: 'desc' },
      take: 4,
    });

    return tools;
  }

  async getPinnedResources(userId: string) {
    const pinned = await this.prisma.pinnedResource.findMany({
      where: { userId },
      include: {
        resource: {
          include: {
            tags: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                department: true,
              },
            },
          },
        },
      },
      orderBy: { pinnedAt: 'desc' },
    });

    return pinned.map((p) => ({
      ...p.resource,
      pinnedAt: p.pinnedAt,
    }));
  }

  async getLearningPath(userId: string) {
    const progress = await this.prisma.userCourseProgress.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 3,
    });

    const upcomingWorkshops = await this.prisma.workshopSession.findMany({
      where: {
        scheduledAt: { gt: new Date() },
        registrations: { some: { userId } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 2,
      include: {
        registrations: {
          where: { userId },
        },
      },
    });

    const allUpcoming = await this.prisma.workshopSession.findMany({
      where: { scheduledAt: { gt: new Date() } },
      orderBy: { scheduledAt: 'asc' },
      take: 3,
    });

    return {
      activeCourses: progress.map((p) => ({
        courseId: p.courseId,
        courseTitle: p.course.title,
        category: p.course.category,
        currentModule: p.currentModuleId
          ? p.course.modules.find((m) => m.id === p.currentModuleId)
          : p.course.modules[0],
        progressPercent: p.progressPercent,
        estimatedMinutes: p.course.estimatedMinutes,
        startedAt: p.startedAt,
      })),
      upcomingWorkshops: allUpcoming,
    };
  }

  async getNorthStar() {
    return {
      title: 'Delivering Excellence Through Digital Transformation',
      subtitle:
        'Accelerating BioMarin\'s innovation through powerful platforms, strategic transformations, and connected digital collaborations.',
      badgeText: 'North Star Vision',
      backgroundGradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #60A5FA 100%)',
    };
  }
}
