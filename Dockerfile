FROM node:14-slim AS build-env

# 设置环境变量
ENV MY_HOME=/app
# 新建文件夹
RUN mkdir -p $MY_HOME
# 指定工作目录
WORKDIR $MY_HOME

COPY ["package.json", "package-lock.json*", ".npmrc", "./"]

RUN npm install

COPY . .

RUN npm run build

# # Second stage - build image
FROM node:14-slim
WORKDIR /app

# 设置相应的时区:http://blog.w2fzu.com/2016/11/21/2016-11-21-Node-and-Mysql-deploy-on-Docker/
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


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


#取消注释以在安装 puppeteer 时跳过 Chrome 下载。如果你这样做了，
#你需要使用以下命令启动 puppeteer：
#     browser.launch({executablePath: 'google-chrome-stable'})
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

EXPOSE 3000

COPY ["package.json", "package-lock.json*", ".npmrc", "./"]


RUN npm install --procuction



COPY --from=build-env /app/dist ./dist
COPY --from=build-env /app/public ./public

RUN ls

RUN pwd




CMD ["node", "./dist/main.js"]