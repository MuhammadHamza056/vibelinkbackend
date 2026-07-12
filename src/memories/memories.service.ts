import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Memory, MemoryDocument } from './schemas/memory.schema';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { MEMORY_URL_PREFIX, UploadedImage } from './memory-upload.config';
import { UsersService } from '../users/users.service';

@Injectable()
export class MemoriesService {
  constructor(
    @InjectModel(Memory.name)
    private readonly memoryModel: Model<MemoryDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateMemoryDto, image?: UploadedImage) {
    // The Swagger-only `image` field never carries data in the body.
    delete (dto as { image?: unknown }).image;
    // The memory image comes only from an uploaded camera/gallery file.
    const imageUrl = image
      ? `${MEMORY_URL_PREFIX}/${image.filename}`
      : undefined;
    const memory = await this.memoryModel.create({
      userId: new Types.ObjectId(userId),
      title: dto.title,
      caption: dto.caption,
      imageUrl,
      vibeTags: dto.vibeTags ?? [],
    });
    await this.usersService.incrementCounters(userId, { memoriesCount: 1 });
    return memory.toJSON();
  }

  async findMine(userId: string) {
    const memories = await this.memoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    return memories.map((m) => m.toJSON());
  }

  async findOne(userId: string, id: string) {
    const memory = await this.memoryModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    if (!memory) throw new NotFoundException('Memory not found');
    return memory.toJSON();
  }

  async remove(userId: string, id: string) {
    const res = await this.memoryModel
      .findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    if (!res) throw new NotFoundException('Memory not found');
    await this.usersService.incrementCounters(userId, { memoriesCount: -1 });
    return { deleted: true, id };
  }
}
