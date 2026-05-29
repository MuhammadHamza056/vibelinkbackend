import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  ChallengeCategory,
  ChallengeDifficulty,
} from '../../common/constants/app.constants';

export class QueryChallengesDto {
  @ApiPropertyOptional({ enum: ChallengeCategory })
  @IsOptional()
  @IsEnum(ChallengeCategory)
  category?: ChallengeCategory;

  @ApiPropertyOptional({ enum: ChallengeDifficulty })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;
}
