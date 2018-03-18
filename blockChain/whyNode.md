## 为什么要基于 Node ?

因为 Node 为开发者们供了许多方便实用的工具。

例如——
1、组织方便：Node.js 拥有**模块化**管理项目的能力，允许 js 代码分散在不同的文件中。
2、资源广泛：Node.js 让 js 第三方包大量涌现。需要什么，一条命令，Node.js 就搞定了。
3、全栈：开发完，还有很多事情要做，比如：要对前端代码js或css文件进行合并、压缩、混淆，以及项目部署等。体验过ruby on rails 一键部署功能的小伙伴，都会印象深刻。Node.js也很容易做到，而且更加自然、流畅。

总之，有了 Node.js，我们可以像开发后台程序一样组织前端代码和项目了；有了Node.js，就有了它背后**强大的技术社区支持**。

## 什么是 Node？

官方：
> Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

Node.js 是一个搭建在 Chrome V8 上的 JavaScript 即时运行平台，采用事件驱动、非阻塞I/O模型，既轻量又高效。

再多夸一句就是，Node.js是一个可以让开发者利用 JavaScript 语言开发应用的平台, 是构建运行在分布式设备上的、数据密集型实时程序的完美选择。

## 几行实用代码

安装使用CNpm：使用淘宝npm镜像，可以提高我们的组件下载数度

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

安装前端管理工具 bower：

```
cnpm install -g bower 
```

当然也可以使用 npm install * 命令，二者一样，只不过cnpm使用淘宝镜像，在中国安装会快些

bower 是一个 npm 包，它专门用来管理 web 前端（包含js,css,images,fonts等）依赖包。我们可以简单类比，bower 用于管理前端包，npm 管理后台库（包）。

[本文摘自亿书](http://bitcoin-on-nodejs.ebookchain.org/2-Node.js入门指南/2-Nodejs让您的前端开发像子弹飞一样.html)


