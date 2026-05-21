import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto, UpdateSkillsDto, UpdateInterestsDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: { status: { not: 'inactive' } },
        include: { skills: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { status: { not: 'inactive' } } }),
    ]);

    return {
      data: users.map(this.sanitizeUser),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        interests: true,
        tools: true,
        directReports: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            avatarUrl: true,
          },
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
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        interests: true,
        tools: true,
        contributions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
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
        reportsTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(id: string, requestingUserId: string, requestingUserRole: string, dto: UpdateProfileDto) {
    if (id !== requestingUserId && requestingUserRole !== 'admin') {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    return this.sanitizeUser(user);
  }

  async getProjects(id: string) {
    const projects = await this.prisma.userProject.findMany({
      where: { userId: id },
      include: {
        initiative: {
          include: {
            category: true,
            tags: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return projects;
  }

  async getContributions(id: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [contributions, total] = await Promise.all([
      this.prisma.userContribution.findMany({
        where: { userId: id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userContribution.count({ where: { userId: id } }),
    ]);

    return {
      data: contributions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateSkills(id: string, requestingUserId: string, requestingUserRole: string, dto: UpdateSkillsDto) {
    if (id !== requestingUserId && requestingUserRole !== 'admin') {
      throw new ForbiddenException('You can only update your own skills');
    }

    await this.prisma.userSkill.deleteMany({ where: { userId: id } });

    if (dto.skills && dto.skills.length > 0) {
      await this.prisma.userSkill.createMany({
        data: dto.skills.map((s) => ({
          userId: id,
          skill: typeof s === 'string' ? s : s.skill,
          category: typeof s === 'string' ? 'technical' : (s.category || 'technical'),
        })),
      });
    }

    return this.prisma.userSkill.findMany({ where: { userId: id } });
  }

  async updateInterests(id: string, requestingUserId: string, requestingUserRole: string, dto: UpdateInterestsDto) {
    if (id !== requestingUserId && requestingUserRole !== 'admin') {
      throw new ForbiddenException('You can only update your own interests');
    }

    await this.prisma.userInterest.deleteMany({ where: { userId: id } });

    if (dto.interests && dto.interests.length > 0) {
      await this.prisma.userInterest.createMany({
        data: dto.interests.map((interest) => ({ userId: id, interest })),
      });
    }

    return this.prisma.userInterest.findMany({ where: { userId: id } });
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
