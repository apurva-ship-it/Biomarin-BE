import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string, limit = 10) {
    if (!query || query.trim().length < 2) {
      return { initiatives: [], resources: [], experts: [], tools: [] };
    }

    const q = query.trim();

    const [initiatives, resources, experts, tools] = await Promise.all([
      this.prisma.initiative.findMany({
        where: {
          status: { not: 'archived' },
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { subtitle: { contains: q } },
            { tags: { some: { tag: { contains: q } } } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          status: true,
          isTrending: true,
          tags: { take: 3 },
        },
        orderBy: [{ isTrending: 'desc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.resource.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { tags: { some: { tag: { contains: q } } } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          type: true,
          department: true,
          tags: { take: 3 },
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: {
          status: 'active',
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { title: { contains: q } },
            { department: { contains: q } },
            { skills: { some: { skill: { contains: q } } } },
          ],
        },
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          title: true,
          department: true,
          avatarUrl: true,
          availabilityStatus: true,
          skills: { take: 3 },
        },
        orderBy: { firstName: 'asc' },
      }),
      this.prisma.tool.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          category: true,
          usageCount: true,
          isTrending: true,
          externalUrl: true,
        },
        orderBy: { usageCount: 'desc' },
      }),
    ]);

    return { initiatives, resources, experts, tools };
  }
}
