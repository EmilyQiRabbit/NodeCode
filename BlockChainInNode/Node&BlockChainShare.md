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
（壹） 区块链基础
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（贰） 共识机制：工作量证明 PoW
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（叁） Node 服务
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（肆） 区块结构
</div>
<div style='text-align: left; margin-left: 35%; line-height: 65px'>
（伍） 哈希算法和加密
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

# （贰）共识机制

## **共识**

> 货币的本质不是信用，而是共识。货币本身甚至可以没有实体的存在，如雅浦岛石币，只要达成共识，就算摸不着沉在深海，因为共识，也将被认可、继续流通。

[slide]

# （贰）共识机制：工作量证明 PoW

### 什么是共识机制？

-------

> 共识机制可以被解释为：**可编程的利益转移规则**。借助共识机制（也就是某一套规则），加密货币有可能建立起一个“**无需监管**的自适应经济系统”。

-------

### （贰）什么是 PoW ？

-------

> PoW（Proof of Work）的原理非常简单，就是多劳多得：你付出多少劳动（劳动 = 计算服务 = 算力x时长），就会获得多少报酬（加密货币）。比特币的共识机制就是 PoW。

[slide]

# （伍）哈希算法

``` JavaScript
const crypto = require('crypto');
function calculateHash(block) {
  let record = block.index + block.timestamp + block.secrets + block.prevHash + block.nonce
  return crypto.createHash('sha256').update(record).digest('hex');
}
```
[slide]

# （伍）签名和加密 -- 签名

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

# （伍）代码实现（**From Ebooker**）

```JavaScript
ed = require('ed25519'),
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

# （伍）签名的代码实现

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

# （伍）签名的验证

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
