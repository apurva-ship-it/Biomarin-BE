import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiQueryDto, FeedbackDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async query(dto: AiQueryDto, userId: string) {
    const { question, conversationId } = dto;

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await this.prisma.aiConversation.findFirst({
        where: { id: conversationId, userId },
      });
    }

    if (!conversation) {
      conversation = await this.prisma.aiConversation.create({
        data: {
          userId,
          title: question.substring(0, 100),
        },
      });
    }

    // Save user message
    await this.prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: question,
      },
    });

    // Generate mock AI response based on question keywords
    const aiResponse = this.generateMockResponse(question);

    // Fetch related initiatives for context
    const relatedInitiatives = await this.prisma.initiative.findMany({
      where: {
        OR: [
          { title: { contains: this.extractKeyword(question) } },
          { description: { contains: this.extractKeyword(question) } },
          { tags: { some: { tag: { contains: this.extractKeyword(question) } } } },
        ],
        status: 'active',
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        status: true,
        teamName: true,
        targetLaunchDate: true,
        tags: true,
      },
    });

    // Fetch related resources
    const relatedResources = await this.prisma.resource.findMany({
      where: {
        OR: [
          { title: { contains: this.extractKeyword(question) } },
          { description: { contains: this.extractKeyword(question) } },
        ],
        deletedAt: null,
      },
      take: 3,
      select: { id: true, title: true, type: true },
    });

    const sources = [
      ...relatedResources.map((r) => ({ title: r.title, type: 'resource', id: r.id })),
      ...relatedInitiatives.slice(0, 2).map((i) => ({ title: i.title, type: 'initiative', id: i.id })),
    ];

    const sourcesJson = JSON.stringify(sources);

    // Save AI message
    const aiMessage = await this.prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
        sources: sourcesJson,
      },
    });

    // Update conversation timestamp
    await this.prisma.aiConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    const documentCount = await this.prisma.resource.count({ where: { deletedAt: null } });
    const initiativeCount = await this.prisma.initiative.count({ where: { status: 'active' } });
    const userCount = await this.prisma.user.count({ where: { status: 'active' } });

    return {
      conversationId: conversation.id,
      messageId: aiMessage.id,
      answer: aiResponse,
      sources,
      relatedInitiatives,
      resultCounts: {
        all: documentCount + initiativeCount + userCount,
        documents: documentCount,
        initiatives: initiativeCount,
        teams: userCount,
      },
    };
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.aiConversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      ...conversation,
      messages: conversation.messages.map((m) => ({
        ...m,
        sources: m.sources ? JSON.parse(m.sources) : [],
      })),
    };
  }

  async submitFeedback(conversationId: string, messageId: string, dto: FeedbackDto, userId: string) {
    const conversation = await this.prisma.aiConversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.aiMessage.update({
      where: { id: messageId },
      data: {
        feedback: dto.feedback,
        feedbackText: dto.feedbackText,
      },
    });
  }

  async search(query: string, tab = 'all', page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const results: any = {};

    if (tab === 'all' || tab === 'documents') {
      results.documents = await this.prisma.resource.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { tags: { some: { tag: { contains: query } } } },
          ],
        },
        take: tab === 'all' ? 5 : limit,
        skip: tab === 'all' ? 0 : skip,
        include: { tags: true },
      });
    }

    if (tab === 'all' || tab === 'initiatives') {
      results.initiatives = await this.prisma.initiative.findMany({
        where: {
          status: { not: 'archived' },
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { tags: { some: { tag: { contains: query } } } },
          ],
        },
        take: tab === 'all' ? 5 : limit,
        skip: tab === 'all' ? 0 : skip,
        include: { tags: true, category: true },
      });
    }

    if (tab === 'all' || tab === 'teams') {
      results.teams = await this.prisma.user.findMany({
        where: {
          status: 'active',
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { title: { contains: query } },
            { department: { contains: query } },
            { skills: { some: { skill: { contains: query } } } },
          ],
        },
        take: tab === 'all' ? 5 : limit,
        skip: tab === 'all' ? 0 : skip,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          title: true,
          department: true,
          avatarUrl: true,
          skills: true,
        },
      });
    }

    return results;
  }

  async getSuggestions(userId: string) {
    return [
      'Summarize the Q3 digital transformation goals',
      'Find experts in machine learning',
      'What AI initiatives are currently active?',
      'Show me the latest supply chain updates',
      'Draft a project brief for a new initiative',
      'What resources are available for Salesforce Marketing Cloud?',
      'Who are the top data engineers in the organization?',
    ];
  }

  private generateMockResponse(question: string): string {
    const q = question.toLowerCase();

    if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('machine learning')) {
      return `Based on the platform's knowledge base, I found several relevant AI-related initiatives and resources.\n\n**Active AI Initiatives:**\n- **Unlock AI-Driven Decision Making** — Implementing AI-powered tools across business functions to automate decisions and surface actionable insights\n- **Supply Chain Optimization AI** — Using ML models to optimize supply chain operations and predict demand\n- **Accelerate Trials with Digital Biomarkers** — Integrating AI-powered digital biomarker collection\n\n**Key Resources:**\n- Q3 Go-to-Market Strategy (Framework)\n- API Security Best Practices (Guide)\n\nOur platform currently has **3 active AI initiatives** and several experts in AI/ML including Ishika Gupta (Director of AI Innovation) and Elena Chen (Data Science Lead). Would you like to connect with any of them?`;
    }

    if (q.includes('marketing') || q.includes('sfmc') || q.includes('salesforce')) {
      return `Here's what I found related to Marketing initiatives on our platform:\n\n**Marketing Initiatives:**\n- **Reimagine Marketing with SFMC** (Trending) — Transforming customer engagement through Salesforce Marketing Cloud\n- **CDP 2.0 Migration** — Next-generation Customer Data Platform migration\n\n**Marketing Resources:**\n- Q3 Go-to-Market Strategy (Framework)\n- Marketing Budget Template\n- Global Brand Guidelines V3\n\n**Team:** The Commercial IT team is leading the SFMC initiative. Usage has reached 1.2k interactions through the AI Content Generator tool this week.`;
    }

    if (q.includes('supply chain') || q.includes('logistics')) {
      return `Regarding supply chain initiatives and resources:\n\n**Supply Chain Optimization AI** is currently active with the following objectives:\n- Reduce average shipping transit time by 15% ✅ *Completed*\n- Automate 80% of vendor rerouting decisions *(In Progress)*\n- Establish data quality score of 95%+ *(Planned)*\n\n**Technology Stack:** AWS Cloud, Databricks, Snowflake\n\n**Recent Update:** Phase 2 Deployment was successful with 12 new data sources connected and 40% improvement in query performance.`;
    }

    if (q.includes('expert') || q.includes('who') || q.includes('contact')) {
      return `I found several subject matter experts on our platform that match your query:\n\n**Top Experts:**\n1. **Ishika Gupta** — Director of AI Innovation (AI Strategy, Machine Learning, Data Analytics)\n2. **Rahul Sharma** — Senior Cloud Architect (AWS, DevOps, Security, Kubernetes)\n3. **Elena Chen** — Data Science Lead (Machine Learning, Python, TensorFlow)\n4. **Raghavendra Agara** — Head of Data Platform (Data Engineering, Snowflake)\n\nYou can contact them via email or Teams directly from the Expert Directory.`;
    }

    if (q.includes('resource') || q.includes('template') || q.includes('document')) {
      return `I found the following resources in our library:\n\n**Templates & Frameworks:**\n- Q3 Go-to-Market Strategy *(Framework — Marketing)*\n- Marketing Budget Template *(Template — Finance)*\n- Product Launch Framework *(Framework — Product)*\n- Q4 Consolidated Budget Template *(Template — Finance)*\n\n**Guides & Documentation:**\n- Employee Handbook 2024\n- Global Brand Guidelines V3\n- API Security Best Practices\n\nAll resources are available in the Resource Library. Would you like me to help you find something specific?`;
    }

    // Default response
    return `Based on the Catalyst Hub knowledge base, here's what I found related to your query:\n\n**Summary:** Your question touches on several aspects of our digital transformation platform. Here are the key findings:\n\n1. **Initiatives** — We have 8 active strategic initiatives across Technology, Data & AI, and Process Transformation categories\n2. **Resources** — The Resource Library contains frameworks, templates, guides, and presentations\n3. **Experts** — 15+ subject matter experts are available across engineering, data, marketing, and regulatory domains\n\n**Suggested Actions:**\n- Browse the Initiatives page for detailed project information\n- Visit the Expert Directory to connect with specialists\n- Check the Resource Library for relevant documents\n\nWould you like me to search for something more specific?`;
  }

  private extractKeyword(question: string): string {
    const stopWords = ['what', 'how', 'where', 'when', 'who', 'is', 'are', 'the', 'a', 'an', 'in', 'about', 'for', 'me', 'tell', 'find', 'show'];
    const words = question.toLowerCase().split(/\s+/);
    const keywords = words.filter((w) => !stopWords.includes(w) && w.length > 2);
    return keywords[0] || question.substring(0, 20);
  }
}
