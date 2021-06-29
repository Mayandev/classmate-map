# 🧭 同学在哪儿

![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/class-2.png)

「同学在哪儿」小程序是一款设计精美、体验优良的地图信息展示小程序，一个更有意思的同学录。可以在小程序中查看班级同学的毕业去向以及地域分布，多联（蹭）系（饭）。更详细的介绍可以查看下方的文章链接。

相关链接：

- [一个 Weekend Project 引发的产品设计思考](https://mp.weixin.qq.com/s/fWhdZCg-qwGLYzjLA1v-Xw)
- [「同学在哪儿」小程序](https://mp.weixin.qq.com/s/TfMnVZmHXd3mhzGPzRKA0g)
- [小程序 Sketch 设计稿](https://www.yuque.com/books/share/7685a0ce-dbf1-407a-b624-ef2203b29951)

小程序二维码：

![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/v2-6a783f32c467334cea900e06429ea943_1440w.jpg)

## 开发

技术栈：

- Taro
- TypeScript
- SCSS
- 云开发

如果你想对这个小程序进行二次开发，你可以 fork 这个仓库，并 clone 到本地。

```bash
# 克隆项目
$ git clone https://github.com/Mayandev/classmate-map.git
# 进入项目目录
$ cd classmate-map
# 切换到开发分支
$ git checkout dev
```

### 安装依赖

小程序使用 [Taro v2.2.9](https://taro-docs.jd.com/taro/docs/README) 框架，利用小程序云开发存储数据以及前后台交互。

```bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli
# 进入 client 安装项目依赖
$ cd client
$ npm install
```

### 运行项目

使用 Taro 全局命令启动项目，编译好后直接使用小程序开发者工具打开即可预览调试。

```bash
# 调试模式
$ taro build --type weapp --watch
# 编译构建
$ taro build --type weapp
```

如果项目编译报错，请将 Taro 版本回退至指定的 v2.2.9 版本。

如果项目对你有帮助，可以右上角点击 star。
