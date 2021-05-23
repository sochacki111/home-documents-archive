import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { Document, DocumentSchema } from './schemas/document.schema';
import { DocumentsController } from './documents.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
