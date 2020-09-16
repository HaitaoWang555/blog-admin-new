## blog-admin 

### 参考
 1. [https://github.com/macrozheng/mall-admin-web](https://github.com/macrozheng/mall-admin-web)
 2. [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

### 简介
`blog-admin` 此项目为博客后台管理平台 基于Vue+Element+toast-ui实现. 主要功能 内容管理和用户权限管理

### 项目演示
项目在线演示地址：[https://blog.wanghaitao.club/admin](https://blog.wanghaitao.club/admin)

### 项目布局
``` lua
src -- 源码目录
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── layout -- 通用页面加载框架
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 前端页面
    ├── cms -- 内容管理页面
    ├── home -- 首页
    ├── login -- 登录页
    ├── svg-icons -- svg图标展示页
    ├── ums -- 用户权限管理
    └── 404 -- 404 
```

### 搭建步骤
```bash
# 克隆项目
git clone https://github.com/HaitaoWang555/blog-admin-new.git
# 进入项目目录
cd blog-admin-new
# 安装node-sass
npm install node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
# 安装依赖
npm install --registry=https://registry.npm.taobao.org
# 更改配置文件 .env.development VUE_APP_PROXY_TARGET 可选
VUE_APP_PROXY_TARGET = 'https://blog.wanghaitao.club/' # 使用线上接口
# 本地开发 启动项目
npm run dev
```