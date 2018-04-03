#### 本文摘自[亿书](http://bitcoin-on-nodejs.ebookchain.org/3-源码解读/2-入口程序app.js解读.html)

本文介绍一些 Node 可用的基本组件、相关代码，以及一些有关区块链的概念。

## Part 1. CODING PART

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

## Part 2. CONCEPTS OF BLOCKCHAIN

### 共识机制

共识机制可以被解释为：可编程的利益转移**规则**。借助共识机制（也就是某一套规则），加密货币有可能建立起一个“**无需监管的自适应经济系统**”。

共识机制包含各种激励制度和具体算法，比如：交易费用、区块奖励等。目前常用的有三种：PoW，PoS，DPoS。

#### PoW（Proof of Work）：工作量证明机制

原理非常简单，就是多劳多得：你付出多少劳动（劳动 = 计算服务 = 算力x时长），就会获得多少报酬（比特币等加密货币）

#### PoS（Proof of Stake）：股权证明机制。

PoW 中，全网矿工都会耗费 CPU/GPU 资源来计算一道题目争夺记账权；因此你的算力越强，得到记账权的概率也就越大。但其实这是非常浪费资源的，而且目前，为了能获取挖矿奖励，很多用户将算力集中成矿池、矿场来共同挖矿，这与去中心化的方向背道而驰。

而 PoS 则是另一机制，这一机制下不用挖矿，而是一个根据用户持有货币的多少和时间（币龄），发放利息。而创建新区块的权利则是根据用户持有的货币的多少和时间来选择决定的。

![PoS vs PoW](imgs/PoS-vs-PoW.png)

#### DPoS（Delegated Proof of Stake）：授权股权证明机制

>对于 PoS 机制的加密货币，每个节点都可以创建区块，并按照个人的持股比例获得“利息”。而 DPoS 是由被社区选举的可信帐户（受托人，得票数排行前101位）来创建区块。为了成为正式受托人，用户要去社区拉票，获得足够多用户的信任。用户根据自己持有的加密货币数量占总量的百分比来投票。DPoS机制类似于股份制公司，普通股民进不了董事会，要投票选举代表（受托人）代他们做决策。

目前，DPoS 机制是最安全环保、运转高效的共识机制。





