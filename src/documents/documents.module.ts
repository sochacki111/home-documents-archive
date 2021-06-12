import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { Document, DocumentSchema } from './schemas/document.schema';
import { DocumentsController } from './documents.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DocumentsService, UsersService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
