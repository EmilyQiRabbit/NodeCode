const crypto = require('crypto');
const ed = require('ed25519');

let cryptoModule = {
  output: fun1
}

function fun1(){
  var hash = crypto.createHash('sha256').update('https://github.com/EmilyQiRabbit').digest()
  var keypair = ed.MakeKeypair(hash);
  console.log(keypair.publicKey.toString('hex'))
  console.log(keypair.privateKey.toString('hex'))
}

module.exports = cryptoModule;