import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, setFileName } from '../utils/file-upload.utils';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './schemas/document.schema';

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
  @UseGuards(JwtAuthenticationGuard)
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // TODO Make saving image and in database atomic
    await this.documentsService.create({
      ...createDocumentDto,
      image: file.filename,
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

  @Get(':id')
  async findOne(@Param() params): Promise<Document> {
    return this.documentsService.findOne(params.id);
  }
}
