import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { QueryChallengesDto } from './dto/query-challenges.dto';

@ApiTags('challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'List active challenges, optionally filtered' })
  findAll(@Query() query: QueryChallengesDto) {
    return this.challengesService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new challenge (admin/seed use)' })
  create(@Body() dto: CreateChallengeDto) {
    return this.challengesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single challenge by id' })
  async findOne(@Param('id') id: string) {
    const challenge = await this.challengesService.findById(id);
    return challenge.toJSON();
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a challenge for the current user' })
  start(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.challengesService.start(userId, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete an active challenge and award XP' })
  complete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.challengesService.complete(userId, id);
  }
}
