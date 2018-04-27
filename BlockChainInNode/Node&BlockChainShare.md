title: Node and BlockChain Share
speaker: Yuqi
theme: moon
date: 2018 年 4 月

[slide]

# Node & BlockChain

### 🌸 **First, Let's Have a try!** 🌸

-------

Just a very simple example 😋

[slide]

推荐学习教程：[亿书](http://bitcoin-on-nodejs.ebookchain.org)

可能是迄今为止最好的网页版演示库：[nodeppt](https://github.com/ksky521/nodeppt)

[slide]

# 目录

<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（壹）区块链基础
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（贰）Node 服务
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（叁）区块结构
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（肆）哈希算法和加密
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（伍）共识机制：工作量证明 PoW
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（陆） P2P 网络
</div>

[slide]

# （壹）区块链 -- 形象化的理解

> 人们通常把具有先后顺序的数据结构，使用栈来表示。
> 我们可以把第一个区块（创世区块）作为栈底，然后其他区块按照时间顺序依次堆叠在上面，这样一来，区块与首区块之间的距离就表示“高度”，“顶端”就表示最新添加的区块。
> 每个区块包含大量交易，就是包含在对应栈里的数据。我们可以把这样的结构想象成一个大大的橱柜，区块就是其中一个抽屉，每个抽屉里都是满满的交易。

[slide]

# （壹）区块链的特点

* <span style='color: #e1473c'>分布存储</span>：区块链处于 P2P 网络之中，必须要采取分布式存储，并使用一种机制保证区块链的同步和统一;

-------

* <span style='color: #e1473c'>公开透明</span>：每个节点都有一个区块链副本，区块链本身没有加密，数据可以任意检索和查询，甚至可以修改（改了也没用）;

-------

* <span style='color: #e1473c'>无法篡改</span>：这是加密技术的巧妙应用，**每一区块都会记录前一区块的信息，并实现验证，确保无法篡改。这里的无法篡改不是不能改，而是局部修改的数据，无法通过验证**，要想通过验证，必须修改整个区块链，这在理论上可行，操作上不可行;

-------

* <span style='color: #e1473c'>方便追溯</span>：区块链是公开的，从任一区块都可以向前追溯，直到第一个区块，并通过区块查到与之关联的全部交易；

-------

* <span style='color: #e1473c'>存在分叉</span>：这是由 P2P 网络等物理环境，以及软件开发实践过程决定的，人们无法根本性杜绝。

[slide]

# （贰）Node 服务

## npm start 👉 "start": "node nodeService"

**Go and Check the code in VSCode**

[slide]

# （叁）区块结构

```JavaScript
class Block {
  constructor(options){
    if (options){
      this.index = options.index
      this.timestamp = options.timestamp || (new Date()).getTime().toString()
      this.secrets = options.secrets
      this.hash = options.hash
      this.prevHash = options.prevHash
      this.difficulty = options.difficulty
      this.nonce = options.nonce
    }
  }
}
```

[slide]

# （叁）一个简单的创世区块

```JavaScript
class Blockchain {
  constructor(){
    this.chain = []
    // 创建 创世区块
    const timestamp = (new Date()).getTime().toString()
    const genesisBlock  = new Block({
      index: 0,
      timestamp,
      secrets: 'I am the genesisBlock',
      difficulty: DIFFICULTY,
      prevHash: '',
      nonce: -1
    })
    genesisBlock.hash = calculateHash(genesisBlock);
    this.chain.push(genesisBlock)
  }

  add(block){
    this.chain.push(block)
  }
}
```

[slide]

# （肆）哈希算法

``` JavaScript
const crypto = require('crypto');
function calculateHash(block) {
  let record = block.index + block.timestamp + block.secrets + block.prevHash + block.nonce
  return crypto.createHash('sha256').update(record).digest('hex');
}
```
[slide]

# （肆）签名和加密 -- 签名

签名的作用是确定资产所属，其特征是简单、安全、可验证。

数字货币采用数字签名。

----------

一个数字签名体系包含下面的<span style='color: #e1473c'>三个算法<span>：

**1：(sk, pk) := generateKeys( keysize )**

这个操作生产两把钥匙 sk（私钥）和 pk（公钥）。私钥 sk 是一个秘密签名钥匙，是你要签名保护的信息；公钥 pk 是公共验证钥匙，你将公钥公布给所有人，任何人都可以用公钥来验证签名的有效性。

**2：sig := sign( sk , message )**

签名运算，该运算将私钥和你想要签名的信息作为输入，输出的 sig 是一些字串符，表示你的签名。

**3：sValid := verify( pk , message , sig )**

验证计算，该计算将签名者的公钥、被签名的信息和签名消息sig作为输入，对该签名是否有效，仅返回是或否。

[slide]

# （肆）代码实现（**From Ebooker**）

```JavaScript
// ed25519：椭圆曲线加密/签名/密钥交换算法
ed = require('ed25519')
// Block.prototype.create
block.blockSignature = this.sign(block, data.keypair);

...

Block.prototype.sign = function (block, keypair) {
	var hash = this.getHash(block);
	return ed.Sign(hash, keypair).toString('hex');
}

...

Block.prototype.getHash = function (block) {
	return crypto.createHash('sha256').update(this.getBytes(block)).digest();
}

```

[slide]

# （肆）签名的代码实现

```JavaScript
ed = require('ed25519'),
Block.prototype.getBytes = function (block) {
	var size = 4 + 4 + 8 + 4 + 4 + 8 + 8 + 4 + 4 + 4 + 32 + 32 + 64;

	try {
		var bb = new ByteBuffer(size, true);
		bb.writeInt(block.version);
		bb.writeInt(block.timestamp);

		if (block.previousBlock) {
			var pb = bignum(block.previousBlock).toBuffer({size: '8'});

			for (var i = 0; i < 8; i++) {
				bb.writeByte(pb[i]);
			}
		} else {
			for (var i = 0; i < 8; i++) {
				bb.writeByte(0);
			}
		}

		bb.writeInt(block.numberOfTransactions);
		bb.writeLong(block.totalAmount);
		bb.writeLong(block.totalFee);
		bb.writeLong(block.reward);

		bb.writeInt(block.payloadLength);

		var payloadHashBuffer = new Buffer(block.payloadHash, 'hex');
		for (var i = 0; i < payloadHashBuffer.length; i++) {
			bb.writeByte(payloadHashBuffer[i]);
		}

		var generatorPublicKeyBuffer = new Buffer(block.generatorPublicKey, 'hex');
		for (var i = 0; i < generatorPublicKeyBuffer.length; i++) {
			bb.writeByte(generatorPublicKeyBuffer[i]);
		}

		if (block.blockSignature) {
			var blockSignatureBuffer = new Buffer(block.blockSignature, 'hex');
			for (var i = 0; i < blockSignatureBuffer.length; i++) {
				bb.writeByte(blockSignatureBuffer[i]);
			}
		}

		bb.flip();
		var b = bb.toBuffer();
	} catch (e) {
		throw Error(e.toString());
	}

	return b;
}
```

[slide]

# （肆）签名的验证

```JavaScript
ed = require('ed25519'),
Block.prototype.verifySignature = function (block) {
	var remove = 64;

	try {
		var data = this.getBytes(block);
		var data2 = new Buffer(data.length - remove);

		for (var i = 0; i < data2.length; i++) {
			data2[i] = data[i];
		}
		var hash = crypto.createHash('sha256').update(data2).digest();
		var blockSignatureBuffer = new Buffer(block.blockSignature, 'hex');
		var generatorPublicKeyBuffer = new Buffer(block.generatorPublicKey, 'hex');
		var res = ed.Verify(hash, blockSignatureBuffer || ' ', generatorPublicKeyBuffer || ' ');
	} catch (e) {
		throw Error(e.toString());
	}

	return res;
}
```
[slide]

# （伍）共识机制

## **共识**

> 货币的本质不是信用，而是共识。货币本身甚至可以没有实体的存在，如雅浦岛石币，只要达成共识，就算摸不着沉在深海，因为共识，也将被认可、继续流通。

[slide]

# （伍）共识机制：工作量证明 PoW

### 什么是共识机制？

-------

> 共识机制可以被解释为：**可编程的利益转移规则**。借助共识机制（也就是某一套规则），加密货币有可能建立起一个“**无需监管**的自适应经济系统”。

-------

### （伍）什么是 PoW ？

-------

> PoW（Proof of Work）的原理非常简单，就是多劳多得：你付出多少劳动（劳动 = 计算服务 = 算力x时长），就会获得多少报酬（加密货币）。比特币的共识机制就是 PoW。

[slide]

# （伍）工作量证明 PoW 代码实现

```JavaScript

function isHashValid(hash, difficulty) { // 判断哈希值是否有效
  let prefix = '0'.repeat(difficulty)
  return hash.toString().startsWith(prefix)
}

function generateBlock(oldBlock, secrets) { // 生成区块
  let newBlock = new Block()

  newBlock.index = oldBlock.index + 1
  newBlock.timestamp = (new Date()).getTime().toString()
  newBlock.secrets = secrets
  newBlock.prevHash = oldBlock.hash
  newBlock.difficulty = DIFFICULTY

  let hex = 0;
  while(true){
    newBlock.nonce = hex
    hex++
    const newCalculatedHash = calculateHash(newBlock);
    if (isHashValid(newCalculatedHash, newBlock.difficulty)) {
      console.log('Current hash: ', newCalculatedHash, ', work done!')
      newBlock.hash = newCalculatedHash
      break
    } else {
      console.log('Current hash: ', newCalculatedHash, ', more work!')
    }
  }
  return newBlock
}
```

[slide]

# （陆） P2P 网络

### 加密货币都是**去中心化**的应用，
### 去中心化的基础就是 **P2P（peer-to-peer，对等网络）**网络，其作用和地位不言而喻，无可替代。

--------

#### 🌸 <span style='color: #e1473c'>本节分析部分亿书对于 P2P 网络的实现代码<span> 🌸

[slide]

# （陆） P2P 网络之路由扩展（亿书）

### 基于 http 的 web 应用，抓住**路由的定义、设计与实现**，是快速弄清业务逻辑的简单方法。

--------

### 这部分代码基于大家都比较熟悉的 express

--------

```JavaScript
router.map = map;
...
function map(root, config) {
    var router = this;
    Object.keys(config).forEach(function (params) { // params: "get /" 👉 route
        var route = params.split(" ");
        if (route.length != 2 || ["post", "get", "put"].indexOf(route[0]) == -1) {
            throw Error("wrong map config");
        }
        router[route[0]](route[1], function (req, res, next) { // 相当于：router.get('path', (req, res, next) => {...})
            root[config[params]]({"body": route[0] == "get" ? req.query : req.body}, function (err, response) { 
								// 相当于：shared.getPeers({body: req.query}, (err, response) => {...}) 这是对方法的调用，这个方法在 peer.js 文件中定义了
                if (err) {
                    res.json({"success": false, "error": err});
                } else {
                    return res.json(extend({}, {"success": true}, response));
                }
            });
        });
    });
}
...
// peer.js
router.map(shared, { 
		"get /": "getPeers", // 这个的含义是：路由 + 方法
		"get /version": "version",
		"get /get": "getPeer"
});
```

[slide]

# （陆） P2P 网络之路由扩展（亿书）

### 上一页代码运行的结果，就相当于 👇

-------

```JavaScript
router.get('/peers', function(req, res, next){
    root.getPeers(...);
})
```

[slide]

# （陆） P2P 网络之路由扩展（亿书）

### 我们来看看 getPeers 的代码 👇

-------


```JavaScript
shared.getPeer = function (req, cb) {
	var query = req.body;
	library.scheme.validate(query, { // 校验规则
		//这就说明，我们应该这样请求：http://ip:port/api/peers/get?ip_str=0.0.0.0&port=1234，不然会返回错误信息。
		type: "object",
		properties: {
			ip_str: {
				type: "string",
				minLength: 1
			},
			port: {
				type: "integer",
				minimum: 0,
				maximum: 65535
			}
		},
		required: ['ip_str', 'port']
	}, function (err) {
		... // (next page)
	});
};
```

[slide]

# （陆） P2P 网络之路由扩展（亿书）

### 回调函数 👇

-------

```JavaScript
if (err) {
	return cb(err[0].message);
}

try {
	var ip_str = ip.toLong(query.ip_str);
} catch (e) {
	return cb("Invalid peer");
}

privated.getByFilter({ // 涉及到 dblite 第三方组件，dblite 完成了对 sqlite 数据库的简单封装

	// 🙋（看这里）sqlite 是一款轻量级的数据库，
	// 在 node 中使用它可以用 sqlite3：npm install sqlite3 就好 🎉

	ip: ip_str,
	port: port
}, function (err, peers) {
	if (err) {
		return cb("Peer not found");
	}

	var peer = peers.length ? peers[0] : null;

	if (peer) {
		peer.ip = ip.fromLong(peer.ip);
	}

	cb(null, {peer: peer || {}});
});
```

[slide]

# （陆） P2P 网络之路由扩展（亿书）

### 再看一个写入节点的栗子 👇

-----

写入节点，就是持久化，或者保存到数据库，或者保存到某个文件。这里保存到 sqlite3 数据库里的 peers 表了，代码如下：

-----

```JavaScript
// peer.js 347行
Peer.prototype.onBlockchainReady = function () {
    async.eachSeries(library.config.peers.list, function (peer, cb) {
        library.dbLite.query("INSERT OR IGNORE INTO peers(ip, port, state, sharePort) VALUES($ip, $port, $state, $sharePort)", {
            ip: ip.toLong(peer.ip),
            port: peer.port,
            state: 2, //初始状态为2，都是健康的节点
            sharePort: Number(true)
        }, cb);
    }, function (err) {
        if (err) {
            library.logger.error('onBlockchainReady', err);
        }

        privated.count(function (err, count) {
            if (count) {
                privated.updatePeerList(function (err) {
                    err && library.logger.error('updatePeerList', err);
                    // 364行
                    library.bus.message('peerReady');
                })
                library.logger.info('Peers ready, stored ' + count);
            } else {
                library.logger.warn('Peers list is empty');
            }
        });
    });
}
```