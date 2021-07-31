FROM node:14-slim

WORKDIR /app

# 设置相应的时区:http://blog.w2fzu.com/2016/11/21/2016-11-21-Node-and-Mysql-deploy-on-Docker/
# RUN apk add --no-cache tzdata && \
#     cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone && \
#     apk del tzdata


#安装最新的 chrome dev 包和字体以支持主要字符集（中文、日语、阿拉伯语、希伯来语、泰语和其他一些字符集）
#注意：这会安装必要的库，以使 Puppeteer 
#安装
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

#如果运行 Docker >= 1.13.0 使用 docker run 的 --init arg 来获取僵尸进程，否则
#取消以下行的注释以将 `dumb-init` 作为 PID 1 
#添加 https://github.com/Yelp/dumb -init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init 
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]

#取消注释以在安装 puppeteer 时跳过 Chrome 下载。如果你这样做了，
#你需要使用以下命令启动 puppeteer：
#     browser.launch({executablePath: 'google-chrome-stable'})
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true




#添加用户所以我们不需要 --no-sandbox。
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

#以非特权用户身份运行所有内容。
USER pptruser

COPY ["package.json", "package-lock.json*", ".npmrc", "./"]


EXPOSE 3000

RUN npm install
COPY . .
RUN ls -a
RUN npm run build
CMD ["node", "./dist/main.js"]