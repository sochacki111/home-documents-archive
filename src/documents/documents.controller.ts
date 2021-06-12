import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { diskStorage } from 'multer';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { imageFileFilter, setFileName } from '../utils/file-upload.utils';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document, DocumentDocument } from './schemas/document.schema';
import { Express } from 'express';
import { Multer } from 'multer';
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Document.name)
    private readonly documentModel: Model<DocumentDocument>,
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
    @Req() req: Request,
  ) {
    // if (!req.user._id) {
    //   throw new HttpException(
    //     'User without _id cannot save document',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const owner = (<any>req).user._id;
    // const owner = req.user._id;

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
  @UseGuards(JwtAuthenticationGuard)
  async findAllDocumentsByUserId(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const userId = (<any>req).user._id;
      let foundUser = null;
      let ids = {};

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Incorrect user Id');
      }
      if (userId) {
        foundUser = await this.userModel.findById(userId);
        if (foundUser) {
          ids = { _id: { $in: foundUser.documents } };
        }
      }
      const foundDocuments = await this.documentModel
        .find({
          ...ids,
        })
        .sort({ _id: -1 });

      return res.status(200).send(foundDocuments);
    } catch (err) {
      return res.status(404).send({ error: { message: err.message } });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async findOne(@Param() params): Promise<Document> {
    return this.documentsService.findOne(params.id);
  }
}
