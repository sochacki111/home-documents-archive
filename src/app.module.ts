import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
@Module({
  imports: [
    // TODO Move to .env
    MongooseModule.forRoot('mongodb://localhost:27017/home_documents_archive'),
    DocumentsModule,
    MulterModule.register({
      dest: './files',
    }),
    UsersModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
