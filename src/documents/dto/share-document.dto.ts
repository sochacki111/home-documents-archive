import * as mongoose from 'mongoose';

export class ShareDocumentDto {
  readonly documentId: string;
  readonly shareEmail: string;
}
