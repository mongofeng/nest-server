import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { R } from '../../common/pojo/R';

@Controller('upload')
export class UploadController {
  @Post('multi-upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMutiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return R.ok(files);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return R.ok(file);
  }
}
