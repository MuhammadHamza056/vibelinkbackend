import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';

@ApiTags('memories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List the current user’s memories' })
  findMine(@CurrentUser('userId') userId: string) {
    return this.memoriesService.findMine(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Save a new memory' })
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateMemoryDto,
  ) {
    return this.memoriesService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of the current user’s memories' })
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.memoriesService.findOne(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one of the current user’s memories' })
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.memoriesService.remove(userId, id);
  }
}
