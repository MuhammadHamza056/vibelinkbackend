import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ConnectionStatus } from '../../common/constants/app.constants';

export type ConnectionDocument = HydratedDocument<Connection>;

// One row per pair of users. `requester` pressed "Connect" first; `recipient`
// must accept before the two are linked. A pair has at most one connection.
@Schema({ timestamps: true })
export class Connection {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  requester: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient: Types.ObjectId;

  @Prop({
    type: String,
    enum: ConnectionStatus,
    default: ConnectionStatus.pending,
  })
  status: ConnectionStatus;

  // Challenge the two users are encouraged to complete together. Assigned when
  // the connection is accepted; each user runs it via the normal challenge flow.
  @Prop({ type: String, default: null })
  sharedChallengeId?: string | null;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);

// Prevent two rows for the same direction (requester -> recipient).
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

ConnectionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  },
});
