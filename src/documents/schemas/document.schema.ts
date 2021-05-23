import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type DocumentDocument = Document & mongoose.Document;

@Schema()
export class Document {
  // TODO Add documentOwner
  // _id: string;
  // @Prop()
  // _id?: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
