import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileModule } from './file/file.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [FileModule, PdfModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
