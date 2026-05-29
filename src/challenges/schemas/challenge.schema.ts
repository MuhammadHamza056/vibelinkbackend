import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ChallengeCategory,
  ChallengeDifficulty,
} from '../../common/constants/app.constants';

export type ChallengeDocument = HydratedDocument<Challenge>;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: '🎯' })
  emoji: string;

  @Prop({ type: String, enum: ChallengeCategory, required: true })
  category: ChallengeCategory;

  @Prop({
    type: String,
    enum: ChallengeDifficulty,
    default: ChallengeDifficulty.easy,
  })
  difficulty: ChallengeDifficulty;

  // XP awarded on completion.
  @Prop({ default: 100 })
  xpReward: number;

  // Estimated duration in minutes (5–20 per app constants).
  @Prop({ default: 10 })
  durationMinutes: number;

  @Prop({ type: [String], default: [] })
  vibeTags: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

ChallengeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  },
});
