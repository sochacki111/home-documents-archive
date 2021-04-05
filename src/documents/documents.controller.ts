import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './schemas/document.schema';
import { diskStorage } from 'multer';
import { setFileName, imageFileFilter } from '../utils/file-upload.utils';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: setFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createDocumentDto);
    console.log({ createDocumentDto, file });
    console.log({ createDocumentDto, ...file });
    console.log({ ...createDocumentDto, ...file });
    console.log({ ...createDocumentDto, file });
    await this.documentsService.create({
      ...createDocumentDto,
      image: file.path,
    });

    // await this.documentsService.create({ createDocumentDto, file });
    // await this.documentsService.create(createDocumentDto);
    await this.documentsService.create({
      ...createDocumentDto,
      file: file.buffer,
    });
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get()
  async findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }
}
