import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { R } from '../common/pojo/R';

@Controller('upload')
export class UploadController {
  @Post('muti-upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMutiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return R.ok(files);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return R.ok(file);
  }
}
