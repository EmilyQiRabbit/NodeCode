// 加解密模块

const crypto = require('crypto');
const ed25519 = require('ed25519');

let cryptoModule = {
  output: test1
}

const MESSAGE = 'Q A Z';

// 加密
function cipher(algorithm, key, buffer){
  var encrypted = "";
  var cip = crypto.createCipher(algorithm, key);
  encrypted += cip.update(buffer, 'utf8', 'hex');
  encrypted += cip.final('hex');
  return encrypted;
}

// 解密
function decipher(algorithm, key, encrypted){
  var decrypted = "";
  var decipher = crypto.createDecipher(algorithm, key);
  decrypted += decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 相关 API：https://nodejs.org/api/crypto.html#crypto_class_cipher
// 加解密算法精讲：https://cnodejs.org/topic/504061d7fef591855112bab5

function test1(){
  var hash = crypto.createHash('sha256').update('https://github.com/EmilyQiRabbit').digest()
  var keypair = ed25519.MakeKeypair(hash);
  console.log('publicKey: ', keypair.publicKey.toString('hex'))
  console.log('privateKey: ', keypair.privateKey.toString('hex'))

  var message = MESSAGE
  // 公钥进行加密，如果是Natrium，这里就是私钥加密
  var msgCiphered = cipher('aes192', keypair.publicKey, message); 
  // 私钥进行签名
  var signature = ed25519.Sign(new Buffer(msgCiphered, 'utf8'), keypair.privateKey); 

  // 验证
  if (ed25519.Verify(new Buffer(msgCiphered, 'utf8'), signature, keypair.publicKey)) {
    // 验证函数返回了true，通过验证
    var msg = decipher('aes192', keypair.publicKey, msgCiphered);  //使用Bob的公钥解密

    console.log('签名合法，信息来自 EmilyQiRabbit！');
    console.log('EmilyQiRabbit said: ', msg); //显示信息
  } else {
    // 验证函数返回了false，肯定不是Bob的信息.
    console.log('签名不合法！');
  }

}

module.exports = cryptoModule;