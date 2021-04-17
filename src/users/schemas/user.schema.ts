import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop()
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true })
  public email: string;

  @Prop()
  public name: string;

  @Prop()
  public password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
