import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FilesService } from './files.service';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':fileName')
  @Header('Content-type', 'image/jpg')
  @Header('Content-Disposition', 'attachment; filename=test.jpg')
  async findOne(@Param('fileName') fileName: string, @Res() res: Response) {
    const docImg = await this.filesService.findOne(fileName);
    return docImg.pipe(res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
