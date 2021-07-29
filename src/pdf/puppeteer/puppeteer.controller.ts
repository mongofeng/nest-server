import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import path from 'path';
import puppeteer from 'puppeteer';
import { R } from 'src/common/pojo/R';

@Controller('puppeteer')
export class PuppeteerController {
  @Get('pdf')
  async index(@Query('url') url: string, @Req() request: Request) {
    // 启动pupeteer，加载页面
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // 打开页面
    await page.goto(url, {
      waitUntil: 'networkidle0', // 直到没有相应
    });

    console.log(request.protocol);

    // 自定义文件名
    const date = new Date();
    const nuid = date.getTime() + '_' + Math.round(Math.random() * 1000);

    // 生成pdf
    const pdfFileName = `体检报告_${nuid}.pdf`;

    const pdfFilePath = path.join(__dirname, '../../../temp', pdfFileName);
    await page.pdf({
      path: pdfFilePath,
      format: 'a4',
      scale: 1,
      printBackground: true,
      landscape: false,
      // displayHeaderFooter: false
    });

    browser.close();
    // 返回文件路径
    return R.ok({
      url: `${request.protocol}://${request.hostname}/temp/${pdfFileName}`,
    });
  }
}
