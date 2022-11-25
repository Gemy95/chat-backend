import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  })
  email: string;

  @Prop({ type: Boolean, required: false, default: false })
  isActivated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
