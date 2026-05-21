import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResourceDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    tags?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { tags, type, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      where.tags = {
        some: { tag: { in: tagList } },
      };
    }

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        skip,
        take: limit,
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
          _count: { select: { pinnedBy: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.resource.count({ where }),
    ]);

    return {
      data: resources,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, deletedAt: null },
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
        initiatives: {
          include: {
            initiative: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
      },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }

  async create(dto: CreateResourceDto, userId: string) {
    const resource = await this.prisma.resource.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type || 'document',
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        department: dto.department,
        isFeatured: dto.isFeatured || false,
        createdById: userId,
        tags: dto.tags
          ? { create: dto.tags.map((tag) => ({ tag })) }
          : undefined,
      },
      include: { tags: true },
    });

    return resource;
  }

  async update(id: string, dto: Partial<CreateResourceDto>, userId: string, userRole: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, deletedAt: null },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.createdById !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this resource');
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        department: dto.department,
        isFeatured: dto.isFeatured,
        updatedAt: new Date(),
      },
      include: { tags: true },
    });
  }

  async delete(id: string, userId: string, userRole: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, deletedAt: null },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.createdById !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this resource');
    }

    return this.prisma.resource.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async togglePin(resourceId: string, userId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id: resourceId, deletedAt: null },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    const existing = await this.prisma.pinnedResource.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
    });

    if (existing) {
      await this.prisma.pinnedResource.delete({
        where: { userId_resourceId: { userId, resourceId } },
      });
      return { pinned: false };
    } else {
      await this.prisma.pinnedResource.create({
        data: { userId, resourceId },
      });
      return { pinned: true };
    }
  }
}
