import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateInitiativeDto,
  CreateInitiativeUpdateDto,
  ToggleObjectiveDto,
} from './dto/create-initiative.dto';

@Injectable()
export class InitiativesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    team?: string;
    technology?: string;
    impact?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, team, technology, impact, category, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: { not: 'archived' },
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { subtitle: { contains: search } },
        { tags: { some: { tag: { contains: search } } } },
      ];
    }

    if (team) {
      where.teamName = { contains: team };
    }

    if (technology) {
      where.capabilities = {
        some: { name: { contains: technology } },
      };
    }

    if (impact) {
      where.impactLevel = impact.toLowerCase();
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const [initiatives, total] = await Promise.all([
      this.prisma.initiative.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          tags: true,
          capabilities: true,
          teamMembers: {
            take: 3,
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                  title: true,
                },
              },
            },
          },
          _count: {
            select: { objectives: true, updates: true, resources: true },
          },
        },
        orderBy: [{ isTrending: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.initiative.count({ where }),
    ]);

    return {
      data: initiatives,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getCategories() {
    return this.prisma.initiativeCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { initiatives: true } },
      },
    });
  }

  async findBySlug(slug: string, userId?: string) {
    const initiative = await this.prisma.initiative.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        capabilities: true,
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                title: true,
                email: true,
                teamsHandle: true,
              },
            },
          },
        },
        objectives: {
          orderBy: { sortOrder: 'asc' },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            initiative: { select: { id: true } },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            title: true,
          },
        },
        _count: {
          select: { resources: true },
        },
      },
    });

    if (!initiative) {
      throw new NotFoundException('Initiative not found');
    }

    let isSaved = false;
    if (userId) {
      const save = await this.prisma.initiativeSave.findUnique({
        where: { userId_initiativeId: { userId, initiativeId: initiative.id } },
      });
      isSaved = !!save;
    }

    return { ...initiative, isSaved };
  }

  async create(dto: CreateInitiativeDto, userId: string) {
    const slug = dto.slug || this.generateSlug(dto.title);

    const initiative = await this.prisma.initiative.create({
      data: {
        title: dto.title,
        slug,
        subtitle: dto.subtitle,
        description: dto.description,
        categoryId: dto.categoryId,
        status: dto.status || 'active',
        impactLevel: dto.impactLevel || 'medium',
        isTrending: dto.isTrending || false,
        isNew: dto.isNew !== undefined ? dto.isNew : true,
        teamName: dto.teamName,
        icon: dto.icon,
        createdById: userId,
        tags: dto.tags
          ? {
              create: dto.tags.map((tag) => ({ tag })),
            }
          : undefined,
        capabilities: dto.capabilities
          ? {
              create: dto.capabilities.map((name) => ({ name })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: true,
        capabilities: true,
      },
    });

    return initiative;
  }

  async update(id: string, dto: Partial<CreateInitiativeDto>, userId: string, userRole: string) {
    const initiative = await this.prisma.initiative.findUnique({ where: { id } });

    if (!initiative) {
      throw new NotFoundException('Initiative not found');
    }

    if (initiative.createdById !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this initiative');
    }

    return this.prisma.initiative.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        categoryId: dto.categoryId,
        status: dto.status,
        impactLevel: dto.impactLevel,
        isTrending: dto.isTrending,
        isNew: dto.isNew,
        teamName: dto.teamName,
        icon: dto.icon,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        tags: true,
        capabilities: true,
      },
    });
  }

  async getObjectives(initiativeId: string) {
    return this.prisma.initiativeObjective.findMany({
      where: { initiativeId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async toggleObjective(initiativeId: string, objectiveId: string, dto: ToggleObjectiveDto, userId: string) {
    const objective = await this.prisma.initiativeObjective.findFirst({
      where: { id: objectiveId, initiativeId },
    });

    if (!objective) {
      throw new NotFoundException('Objective not found');
    }

    return this.prisma.initiativeObjective.update({
      where: { id: objectiveId },
      data: {
        isCompleted: dto.isCompleted,
        completedAt: dto.isCompleted ? new Date() : null,
      },
    });
  }

  async getUpdates(initiativeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [updates, total] = await Promise.all([
      this.prisma.initiativeUpdate.findMany({
        where: { initiativeId },
        skip,
        take: limit,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: {
          initiative: { select: { id: true, title: true } },
        },
      }),
      this.prisma.initiativeUpdate.count({ where: { initiativeId } }),
    ]);

    return {
      data: updates,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createUpdate(initiativeId: string, dto: CreateInitiativeUpdateDto, userId: string) {
    const initiative = await this.prisma.initiative.findUnique({ where: { id: initiativeId } });
    if (!initiative) {
      throw new NotFoundException('Initiative not found');
    }

    return this.prisma.initiativeUpdate.create({
      data: {
        initiativeId,
        title: dto.title,
        body: dto.body,
        authorId: userId,
        isPinned: dto.isPinned || false,
      },
    });
  }

  async toggleSave(initiativeId: string, userId: string) {
    const initiative = await this.prisma.initiative.findUnique({ where: { id: initiativeId } });
    if (!initiative) {
      throw new NotFoundException('Initiative not found');
    }

    const existing = await this.prisma.initiativeSave.findUnique({
      where: { userId_initiativeId: { userId, initiativeId } },
    });

    if (existing) {
      await this.prisma.initiativeSave.delete({
        where: { userId_initiativeId: { userId, initiativeId } },
      });
      return { saved: false };
    } else {
      await this.prisma.initiativeSave.create({
        data: { userId, initiativeId },
      });
      return { saved: true };
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
