import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuthProvider } from '../../common/constants/app.constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class Badge {
  @Prop({ required: true })
  badgeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  emoji: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: () => new Date() })
  earnedAt: Date;
}
export const BadgeSchema = SchemaFactory.createForClass(Badge);

// GeoJSON point used for nearby matching ([lng, lat]).
@Schema({ _id: false })
export class GeoPoint {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], default: undefined })
  coordinates: number[];
}
export const GeoPointSchema = SchemaFactory.createForClass(GeoPoint);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  // Absent for pure social-login accounts.
  @Prop({ select: false })
  passwordHash?: string;

  @Prop({ type: String, enum: AuthProvider, default: AuthProvider.email })
  provider: AuthProvider;

  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  streakDays: number;

  @Prop({ type: [String], default: [] })
  vibeTags: string[];

  @Prop({ type: [BadgeSchema], default: [] })
  badges: Badge[];

  @Prop({ default: 0 })
  challengesCompleted: number;

  @Prop({ default: 0 })
  matchesCount: number;

  @Prop({ default: 0 })
  memoriesCount: number;

  @Prop({ default: false })
  isOnBurnoutGuard: boolean;

  @Prop({ default: false })
  safetyPulseEnabled: boolean;

  @Prop({ default: false })
  hasSeenOnboarding: boolean;

  @Prop({ default: () => new Date() })
  lastActiveDate: Date;

  // IDs of challenges the user has started but not completed.
  @Prop({ type: [String], default: [] })
  activeChallengeIds: string[];

  @Prop({ type: GeoPointSchema, default: undefined })
  location?: GeoPoint;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ location: '2dsphere' });

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});
