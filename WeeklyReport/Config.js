/**
 * 配置二级目录和入口文件
 * @type {{context: string, entry: {panel: string[]}}}
 */

const moduleName = 'Bumblebee'; // TODO: 静态资源目录名称,同步到远端nginx服务器,目录名需要唯一

module.exports = {
  title: '大黄蜂-周报系统',
  pathInMappingJson: '/public/static/',
  reportFrontContext: 'reportFront',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-immutable',
      'immutable',
      'isomorphic-fetch',
      'fetch-ie8',
      'antd'
    ],
    adminPages: ['./client/adminPages/admin.js'],
    userPages: ['./client/userPages/index.js']
  }
};
