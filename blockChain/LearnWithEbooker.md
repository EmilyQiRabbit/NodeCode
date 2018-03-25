#### 本文摘自[亿书](http://bitcoin-on-nodejs.ebookchain.org/3-源码解读/2-入口程序app.js解读.html)

本文介绍一些 Node 可用的基本组件以及相关代码。

### commander

commander 是 Node.js 第三方组件（使用 npm 安装），常被用来开发命令行工具，用法极为简单，Ebooker 源码：

```
// 1行: 引入
var program = require('commander');

// 19行
program
    .version(packageJson.version)
    .option('-c, --config <path>', 'Config file path')
    .option('-p, --port <port>', 'Listening port number')
    .option('-a, --address <ip>', 'Listening host name or ip')
    .option('-b, --blockchain <path>', 'Blockchain db path')
    .option('-x, --peers [peers...]', 'Peers list')
    .option('-l, --log <level>', 'Log level')
    .parse(process.argv);
```

这样，就可以在命令行执行命令时，加带 -c, -p 等选项，例如：

```
node app.js -p 8888
```



