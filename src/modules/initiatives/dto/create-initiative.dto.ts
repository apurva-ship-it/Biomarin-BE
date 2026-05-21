import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateInitiativeDto {
  @ApiProperty({ example: 'Reimagine Marketing with SFMC' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'reimagine-marketing-sfmc', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false, example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, example: 'high' })
  @IsOptional()
  @IsString()
  impactLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isTrending?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teamName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  capabilities?: string[];
}

export class CreateInitiativeUpdateDto {
  @ApiProperty({ example: 'Phase 2 Deployment Successful' })
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class ToggleObjectiveDto {
  @ApiProperty()
  @IsBoolean()
  isCompleted: boolean;
}
