import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

  async getCourses(query: { category?: string; search?: string; page?: number; limit?: number }) {
    const { category, search, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };

    if (category) {
      where.category = { equals: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { modules: true, progress: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { progress: true } },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async getWorkshops(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [workshops, total] = await Promise.all([
      this.prisma.workshopSession.findMany({
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
        include: {
          _count: { select: { registrations: true } },
        },
      }),
      this.prisma.workshopSession.count(),
    ]);

    return {
      data: workshops,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async registerForWorkshop(sessionId: string, userId: string) {
    const session = await this.prisma.workshopSession.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!session) {
      throw new NotFoundException('Workshop session not found');
    }

    const existing = await this.prisma.workshopRegistration.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });

    if (existing) {
      return { registered: true, message: 'Already registered' };
    }

    await this.prisma.workshopRegistration.create({
      data: { userId, sessionId },
    });

    return { registered: true, message: 'Successfully registered' };
  }

  async getMyProgress(userId: string) {
    const [progress, registrations] = await Promise.all([
      this.prisma.userCourseProgress.findMany({
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
      }),
      this.prisma.workshopRegistration.findMany({
        where: { userId },
        include: {
          session: true,
        },
      }),
    ]);

    const activeCourses = progress.filter((p) => !p.completedAt);
    const completedCourses = progress.filter((p) => p.completedAt);
    const upcomingWorkshops = registrations
      .filter((r) => r.session.scheduledAt > new Date())
      .sort((a, b) => a.session.scheduledAt.getTime() - b.session.scheduledAt.getTime());

    return {
      activeCourses: activeCourses.map((p) => ({
        courseId: p.courseId,
        courseTitle: p.course.title,
        category: p.course.category,
        progressPercent: p.progressPercent,
        currentModule: p.currentModuleId
          ? p.course.modules.find((m) => m.id === p.currentModuleId)
          : p.course.modules[0],
        totalModules: p.course.modules.length,
        estimatedMinutes: p.course.estimatedMinutes,
        startedAt: p.startedAt,
      })),
      completedCourses: completedCourses.map((p) => ({
        courseId: p.courseId,
        courseTitle: p.course.title,
        completedAt: p.completedAt,
      })),
      upcomingWorkshops: upcomingWorkshops.map((r) => ({
        sessionId: r.sessionId,
        title: r.session.title,
        scheduledAt: r.session.scheduledAt,
        location: r.session.location,
        durationMinutes: r.session.durationMinutes,
      })),
      stats: {
        totalCoursesStarted: progress.length,
        totalCoursesCompleted: completedCourses.length,
        totalWorkshopsRegistered: registrations.length,
      },
    };
  }
}
