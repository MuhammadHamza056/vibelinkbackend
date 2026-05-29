import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MemoryDocument = HydratedDocument<Memory>;

@Schema({ timestamps: true })
export class Memory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  caption: string;

  @Prop({ default: '' })
  imageUrl: string;

  // Optional link back to the challenge that inspired the memory.
  @Prop({ type: Types.ObjectId, ref: 'Challenge', default: undefined })
  challengeId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  vibeTags: string[];
}

export const MemorySchema = SchemaFactory.createForClass(Memory);

MemorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  },
});
