import { Module } from '@nestjs/common';
import { PuppeteerController } from './puppeteer/puppeteer.controller';

@Module({
  controllers: [PuppeteerController],
})
export class PdfModule {}
