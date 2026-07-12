import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import {
  memoryMulterOptions,
  UploadedImage,
} from './memory-upload.config';

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
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('image', memoryMulterOptions))
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateMemoryDto,
    @UploadedFile() image?: UploadedImage,
  ) {
    return this.memoriesService.create(userId, dto, image);
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
