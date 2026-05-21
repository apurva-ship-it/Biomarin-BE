import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AiQueryDto, FeedbackDto } from './dto/ai.dto';

@ApiTags('AI Assistant')
@ApiBearerAuth('JWT-auth')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  @ApiOperation({ summary: 'Submit question to AI assistant' })
  async query(@Body() dto: AiQueryDto, @CurrentUser() user: any) {
    return this.aiService.query(dto, user.sub);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation history' })
  async getConversation(@Param('id') id: string, @CurrentUser() user: any) {
    return this.aiService.getConversation(id, user.sub);
  }

  @Post('conversations/:id/feedback')
  @ApiOperation({ summary: 'Submit feedback on AI response' })
  async submitFeedback(
    @Param('id') conversationId: string,
    @Body() dto: FeedbackDto & { messageId: string },
    @CurrentUser() user: any,
  ) {
    return this.aiService.submitFeedback(conversationId, dto.messageId, dto, user.sub);
  }

  @Get('search')
  @ApiOperation({ summary: 'Hybrid search across platform content' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'tab', required: false, enum: ['all', 'documents', 'initiatives', 'teams'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('q') query: string,
    @Query('tab') tab = 'all',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.aiService.search(query, tab, page, limit);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get suggested prompts' })
  async getSuggestions(@CurrentUser() user: any) {
    return this.aiService.getSuggestions(user.sub);
  }
}
