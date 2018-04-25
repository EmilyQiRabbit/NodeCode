const crypto = require('crypto');

const DIFFICULTY = 3

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

class Message {
  constructor(options){
    this.secrets = options.secrets
  }
}

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

function isHashValid(hash, difficulty) { // 判断哈希值是否有效
  let prefix = '0'.repeat(difficulty)
  return hash.toString().startsWith(prefix)
}

function calculateHash(block) {
  let record = block.index + block.timestamp + block.secrets + block.prevHash + block.nonce
  return crypto.createHash('sha256').update(record).digest('hex');
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

module.exports = {
  DIFFICULTY,
  Block,
  Message,
  Blockchain,
  isHashValid,
  generateBlock,
  calculateHash
};

