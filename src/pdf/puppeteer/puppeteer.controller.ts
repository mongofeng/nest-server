import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { R } from 'src/common/pojo/R';

@Controller('puppeteer')
export class PuppeteerController {
  @Get('pdf')
  async index(@Query('url') url: string, @Req() request: Request) {
    // 启动pupeteer，加载页面
    const browser = await puppeteer.launch({
      // executablePath: '/usr/bin/chromium-browser',
      executablePath: 'google-chrome-stable',
      headless: true, //可以看到打开浏览器效果，默认值true
      args: ['--disable-dev-shm-usage'],
    });

    //   args 参数中的 --disable-dev-shm-usage 是为了解决 Docker 中 /dev/shm 共享内存太小不足以支持 Chromium 运行的问题，详见 TIPS。
    // args 参数中的 --no-sandbox 是为了避免 Chromium 在 Linux 内核中由 sandbox 导致的启动问题。

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // 打开页面
    await page.goto(url, {
      waitUntil: 'networkidle0', // 直到没有相应
    });

    // 自定义文件名
    const date = new Date();
    const nuid = date.getTime() + '_' + Math.round(Math.random() * 1000);

    // 生成pdf
    const pdfFileName = `体检报告_${nuid}.pdf`;

    const pdfFilePath = path.join(__dirname, '../../../public', pdfFileName);
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
      url: `${request.protocol}://${request.hostname}/static/${pdfFileName}`,
    });
  }
}
