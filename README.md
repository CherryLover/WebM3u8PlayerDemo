# M3U8 播放器

一个基于 React、Tailwind CSS 和 HLS.js 构建的 M3U8 视频流播放器。支持播放 HLS 流媒体内容，并提供了解决跨域 (CORS) 问题的内置代理服务器。

![M3U8 播放器截图](screenshot.png)

## 功能特性

- 播放 HLS 格式的流媒体内容 (.m3u8)
- 使用内置代理服务器解决跨域 (CORS) 问题
- 视频播放控制：播放/暂停、音量调节、进度条拖拽
- 播放历史记录，方便重复访问
- 支持全屏播放
- 现代化响应式 UI 设计

## 快速启动指南

> ⚠️ **重要提示**: 必须同时启动**两个**服务 - 代理服务器和前端应用

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务 (需要两个终端窗口)

**终端 1: 启动代理服务器**

```bash
npm run proxy
```

**终端 2: 启动前端应用**

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问: [http://localhost:5173](http://localhost:5173)

### 4. 播放您的 M3U8 流

1. 确保选中"使用代理解决跨域问题"复选框
2. 点击下方示例链接或输入您的 M3U8 URL
3. 点击"播放"按钮

## 技术栈

- **前端框架**：React 18 + TypeScript
- **样式**：Tailwind CSS
- **HLS 播放**：hls.js
- **构建工具**：Vite
- **代理服务器**：Express + http-proxy-middleware

## 跨域 (CORS) 问题解决方案

本应用内置了一个代理服务器来处理跨域问题。当勾选"使用代理解决跨域问题"选项时，应用会自动将请求通过本地代理服务器进行转发，添加必要的 CORS 头信息，从而允许浏览器访问资源。

代理服务器工作原理：
1. 接收来自前端应用的请求
2. 将请求转发到目标服务器
3. 接收目标服务器的响应并添加 CORS 头
4. 将修改后的响应返回给前端应用

## 示例 M3U8 地址

应用内置了几个可用的示例 M3U8 地址：

- `https://s3-store.flyooo.uk/test/video/m3u8/standard/output.m3u8` - 需要通过代理解决跨域问题
- `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` - Mux 测试流 (支持 CORS)
- `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8` - Tears of Steel 电影示例
- `https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8` - Akamai 测试流

## 常见问题

**Q: 为什么我看到"网络错误"或"加载失败"?**  
A: 通常是因为 CORS 跨域问题。确保选中"使用代理解决跨域问题"选项，或使用已知支持 CORS 的流媒体源。

**Q: 代理服务器未运行怎么办?**  
A: 如果您看到跨域错误，请确保您已经在一个单独的终端中运行了 `npm run proxy` 命令。两个服务都需要同时运行。

**Q: 播放器支持哪些浏览器?**  
A: 播放器基于 hls.js，支持所有现代浏览器。在 Safari 中使用原生 HLS 支持。

**Q: 什么是 M3U8?**  
A: M3U8 是一种播放列表文件格式，用于 HLS (HTTP Live Streaming) 流媒体协议。它包含了视频片段的索引信息。

## 开发构建

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 许可证

MIT 