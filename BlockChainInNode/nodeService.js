// cluster 
var cluster = require('cluster'); // 内置模块
var numCPUs = require('os').cpus().length; // 获取 CPU 的个数

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
  }
  // Node 模块化初探：
  let nodeModule = require('./public/common/utils') // 注意路径书写，似乎 ./ 就表示根目录啊 >.<
  console.log(nodeModule.moduleName);
  
  // crypto 加解密初探：
  let cryptoModule = require('./public/common/cryptoTest.js')
  cryptoModule.output()
  require("./app.js");
  // ...
} else {
  console.log('This is a test about Cluster.')
}

/*
 * 多进程运行涉及的父子进程通信，子进程管理，以及负载均衡等问题，这些特性 cluster 都帮你实现了。
 * 
 * cluster的负载均衡：
 * Node.js v0.11.2+ 的 cluster 模块使用了 round-robin 调度算法做负载均衡，
 * 新连接由主进程接受，然后由它选择一个可用的 worker 把连接交出去，说白了就是轮转法。
 * 算法很简单，但据官方说法，实测很高效。
 * 
 * pm2 是一个现网进程管理的工具，可以做到不间断重启、负载均衡、集群管理等，比 forever 更强大。
 * 利用 pm2 可以做到 no code but just config 实现应用的 cluster。
 * 
 * 参考链接：
 * 解读 Node.js 的 cluster 模块：http://www.alloyteam.com/2015/08/nodejs-cluster-tutorial/
 * 
*/