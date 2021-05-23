import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { diskStorage } from 'multer';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import RequestWithUserWithId from '../authentication/interfaces/requestWithUserWithId.interface';
import { imageFileFilter, setFileName } from '../utils/file-upload.utils';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './schemas/document.schema';
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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
    @Req() req: RequestWithUserWithId,
  ) {
    if (!req.user._id) {
      throw new HttpException(
        'User without _id cannot save document',
        HttpStatus.BAD_REQUEST,
      );
    }
    const owner = req.user._id;

    // TODO Make saving image and in database atomic
    const createdDocument = await this.documentsService.create({
      ...createDocumentDto,
      image: file.filename,
      owner,
    });
    // Save reference to document in User collection
    await this.userModel
      .findByIdAndUpdate(owner, {
        $push: { documents: createdDocument._id },
      })
      .lean()
      .exec();

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
