import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './schemas/document.schema';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseInterceptors(FileInterceptor('file'))
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

    // await this.documentsService.create({ createDocumentDto, file });
    // await this.documentsService.create(createDocumentDto);
    await this.documentsService.create({
      ...createDocumentDto,
      file: file.buffer,
    });
  }

  @Get()
  async findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }
}
