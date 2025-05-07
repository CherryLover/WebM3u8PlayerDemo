FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用（如果需要）
RUN npm run build

# 暴露端口 - 5173 用于前端，3000 用于代理服务器（根据您的应用调整）
EXPOSE 5173 3000

# 创建启动脚本
RUN echo "#!/bin/sh\nnpm run proxy & npm run dev" > /app/start.sh && chmod +x /app/start.sh

# 设置启动命令
CMD ["/bin/sh", "/app/start.sh"] 