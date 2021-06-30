import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadController } from './upload/upload.controller';
import { join } from 'path';
// https://zhuanlan.zhihu.com/p/158026491
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        //自定义路径
        destination: join(__dirname, '../../', 'public'),
        filename: (req, file, cb) => {
          // 自定义文件名
          const date = new Date();
          const nuid = date.getTime() + '_' + Math.round(Math.random() * 1000);
          const filename = `${nuid}.${file.mimetype.split('/')[1]}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadController],
})
export class FileModule {}
