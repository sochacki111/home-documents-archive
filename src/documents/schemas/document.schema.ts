import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type DocumentDocument = Document & mongoose.Document;

@Schema()
export class Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  file: mongoose.Types.Buffer;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
