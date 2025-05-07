#!/bin/sh
# 启动代理服务器
npm run proxy &
# 启动开发服务器，监听所有网络接口
npm run dev -- --host 0.0.0.0 