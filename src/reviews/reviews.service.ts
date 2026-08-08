import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const review = await this.reviewModel.create({
      userId: new Types.ObjectId(userId),
      rating: dto.rating,
      comment: dto.comment ?? '',
      appVersion: dto.appVersion ?? '',
      deviceInfo: dto.deviceInfo ?? '',
    });
    return review.toJSON();
  }

  async findMine(userId: string) {
    const reviews = await this.reviewModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    return reviews.map((r) => r.toJSON());
  }
}
