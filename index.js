const puppeteer = require('puppeteer');
const path = require('path');
async function main() {
  const url = 'https://es6.ruanyifeng.com/#docs/regex';
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

  // 自定义文件名
  const date = new Date();
  const nuid = date.getTime() + '_' + Math.round(Math.random() * 1000);

  // 生成pdf
  const pdfFileName = `体检报告_${nuid}.pdf`;

  const pdfFilePath = path.join(__dirname, './public', pdfFileName);
  await page.setExtraHTTPHeaders({
    Authorization: '11111',
  });
  await page.pdf({
    path: pdfFilePath,
    format: 'a4',
    scale: 1,
    printBackground: true,
    landscape: false,
    preferCSSPageSize: true,
    // displayHeaderFooter: true,
    // margin: {
    //   top: '2cm',
    //   bottom: '2cm',
    // },
    // headerTemplate: `<div style="width:100%;text-align:right;margin-right: 20px;font-size:10px">页头</div>`,
    // footerTemplate: `<div style="width:100%;text-align:right;margin-right: 20px;font-size:10px">页尾</div>`,
  });

  browser.close();
}

main();
