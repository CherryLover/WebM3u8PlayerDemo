// 创建一个简单的代理服务器处理 CORS 问题
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3001;

// 启用 CORS
app.use(cors());

// 代理 M3U8 和 TS 文件请求
app.use('/proxy', createProxyMiddleware({
  target: 'https://s3-store.flyooo.uk',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': ''
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(port, () => {
  console.log(`CORS 代理服务器运行在 http://localhost:${port}`);
}); 