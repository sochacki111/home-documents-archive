import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document, DocumentDocument } from './schemas/document.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name)
    private readonly documentModel: Model<DocumentDocument>,
  ) {}

  async create(createDocumentDto: any): Promise<DocumentDocument> {
    const createdDocument = new this.documentModel({
      title: createDocumentDto.title,
      description: createDocumentDto.description,
      // image: `https://${process.env.DOMAIN}/files/${createDocumentDto.image}`,
      image: `http://${process.env.DOMAIN}:${process.env.PORT}/files/${createDocumentDto.image}`,
      owner: createDocumentDto.owner,
    });
    return createdDocument.save();
  }

  async findAll(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }

  async findOne(id: string): Promise<Document> {
    return this.documentModel.findById(id).exec();
  }
}
