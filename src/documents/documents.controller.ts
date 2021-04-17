import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './schemas/document.schema';
import { diskStorage } from 'multer';
import { setFileName, imageFileFilter } from '../utils/file-upload.utils';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

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
    console.log(file);
    // const createdDocument = await Document.create({
    //   ...createDocumentDto,
    //   image: file.path,
    // });
    await this.documentsService.create({
      ...createDocumentDto,
      image: file.path,
    });
    // console.log(createDocumentDto);
    // console.log({ createDocumentDto, file });
    // console.log({ createDocumentDto, ...file });
    // console.log({ ...createDocumentDto, ...file });
    // console.log({ ...createDocumentDto, file });

    // await this.documentsService.create({ createDocumentDto, file });
    // await this.documentsService.create(createDocumentDto);

    // await this.documentsService.create({
    //   ...createDocumentDto,
    //   file: file.buffer,
    // });

    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get()
  findAll2(): string {
    return 'This action returns all cats';
  }

  // @Get()
  // async findAll(): Promise<Document[]> {
  //   return this.documentsService.findAll();
  // }

  // @Get(':imgpath')
  // seeUploadedFile(@Param('imgpath') image, @Res() res) {
  //   return res.sendFile(image, { root: './files' });
  // }
}
