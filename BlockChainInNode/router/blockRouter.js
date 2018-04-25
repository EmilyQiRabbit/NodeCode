const express = require('express')
const router = express.Router()
// 数据请求路由配置
let BlockChainBase = require('../public/common/BlockChainBase')
let blockChain = new BlockChainBase.Blockchain();

router.post('/requestBlockchain', ( req, res, next ) => {
  return res.json({code: 1, msg: 'Success', data: blockChain.chain})
})

router.post('/addBlock', ( req, res, next ) => {
  const secrets = req.body.secrets;
  if (secrets){
    const newBlock = BlockChainBase.generateBlock(blockChain.chain[blockChain.chain.length - 1], secrets)
    blockChain.add(newBlock)
    return res.json({code: 1, msg: 'New Block Created!', data: null})
  } else {
    return res.json({code: -1, msg: 'Secrets can not be null.', data: null})
  }
})

module.exports = router