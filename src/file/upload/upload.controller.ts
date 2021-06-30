import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('muti-upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMutiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return "上传成功";
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return "上传成功"
  }
}
