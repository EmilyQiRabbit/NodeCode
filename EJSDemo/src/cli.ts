#!/usr/bin/env node
import fs from 'fs-extra'
import { compile } from 'ejs'
import e from 'express'

// 读取配置
const config: any = require('config')
const options = config.default || config

console.log(options)

const { listenPort, serviceTemplateFile } = options

let serviceTemplate: any

const init = () => {
  return fs.readFile(serviceTemplateFile, 'utf8')
    .then((content) => {
      serviceTemplate = compile(content);
    }).then(() => {
      listen()
    });
}

const renderService = () => {
  const data = {
    msg: 'hello EJS'
  };
  return serviceTemplate({ data });
}

const listen = () => {
  return new Promise((resolve) => {
    app.listen(listenPort, '0.0.0.0', () => {
      console.info('http server listening', { port: listenPort });
      resolve();
    });
  });
}

// main
const app = e();
init()

app.get('*', (req, res) => {
  res.end(renderService());
});

// test ts
class GenericNumber<T> {
  zeroValue!: T;
  add!: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) { return x + y }
console.log(myGenericNumber)
