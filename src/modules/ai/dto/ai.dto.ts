import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AiQueryDto {
  @ApiProperty({ example: 'What initiatives are related to AI?' })
  @IsString()
  question: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class FeedbackDto {
  @ApiProperty({ example: 'positive', enum: ['positive', 'negative', 'flagged'] })
  @IsString()
  feedback: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedbackText?: string;
}
