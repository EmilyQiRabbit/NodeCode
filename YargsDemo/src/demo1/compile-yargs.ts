#!/usr/bin/env node
import yargs from 'yargs'

let argv = yargs.argv

if (argv.kind === 'test') {
  console.log('yargs output result >>>', argv.params)
}

argv = yargs.command('start [port] [guid]', 'start the server', (yargs) => {
  return yargs
    .positional('guid', {
      describe: 'a unique identifier for the server',
      type: 'string',
      default: 1937
    })
}, (argv: any) => {
  if (argv.verbose) console.info(`start server on : ${argv.port}`)
})
.option('verbose', {
  alias: 'v',
  default: false
})
.argv

console.log('Now the argvs are >>>', argv)