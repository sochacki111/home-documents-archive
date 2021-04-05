import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    // TODO Move to .env
    MongooseModule.forRoot('mongodb://localhost:27017/home_documents_archive'),
    DocumentsModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
