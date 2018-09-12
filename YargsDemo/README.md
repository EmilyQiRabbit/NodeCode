# Demo

refs:
1. [yargs](https://github.com/yargs/yargs)
2. [ts docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
3. [ejs](https://ejs.bootcss.com)

## The very first Demo0

install 后在 YargsDemo 目录下运行 npm run demo0（即 node ./src/demo0/hello-yargs.js --kind=test --params=helloYargs），可得到输出

```
yargs output result >>> helloYargs
...
```

[更多 yargs api 戳这里](https://github.com/yargs/yargs/blob/master/docs/api.md)

## More complex Demo1

src 目录下的 demo1 是一个 ts 项目，根目录下存在 tsconfig 文件用来配置编译 ts 的规则。

>> The presence of a tsconfig.json file in a directory indicates that the directory is the root of a TypeScript project. The tsconfig.json file specifies the root files and the compiler options required to compile the project.

同时，在 package.json 中，添加了 bin：

```json
"bin": {
  "@yuqi-yargs-demo": "cjs/demo1/compile-yargs.js"
}
```

这样，当安装了 yargs-demo 包的时候，@yuqi-yargs-demo 将自动被放在 bin 目录，作为可执行文件。

>> 需要注意的是：compile-yargs.ts 文件中第一行 `#!/usr/bin/env node` 是必需的。

项目测试的运行步骤为：

1. npm i
2. npm run demo1 (这一步其实就是 build)
3. npm publish (先 npm version patch)
4. npm i -g yargs-demo (安装 yargs-demo 后，@yuqi-yargs-demo 已经在 bin 中，可以被执行)
5. @yuqi-yargs-demo start --port=8000 --kind=test --params=helloYargs --verbose=true

得到输出：

```
yargs output result >>> helloYargs
start server on : 8000
Now the argvs are >>> { _: [ 'start' ],
  port: 8000,
  kind: 'test',
  params: 'helloYargs',
  verbose: 'true',
  v: 'true',
  guid: 1937,
  '$0': '@yuqi-yargs-demo' }
```

