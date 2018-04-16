/**
 * 前台首页路由设置
 */

'use strict'

const express = require('express');
const router = express.Router();

/**
 * 获取css结构
 */
function getCss (key) {
  const fileMapping = global.package[key];
  const buildLink = function (href) {
    return `<link href="${href}" rel="stylesheet">\n`;
  };
  if (fileMapping[`${key}.css`]) {
    return `${buildLink(fileMapping[`${key}.css`])}`;
  } else {
    return '';
  }
}

/**
 * 获取js结构
 */
function getJs (key) {
  const fileMapping = global.package[key];
  const buildScript = function (src) {
    return `<script src="${src}"></script>\n`;
  };
  return `${buildScript(fileMapping[`${key}.js`])}`;
}

/**
 * 获取title
 */
function getTitle (key) {
  const fileMapping = global.package[key];
  return fileMapping.title || 'title';
}

/**
 * 获取Render的数据结构
 */
function getRenderData(moduleName, userInfo = {}) {
  const links = getCss(moduleName);
  const scripts = getJs(moduleName);
  const title = getTitle(moduleName);
  return {
    title,
    links,
    scripts,
    data: JSON.stringify(userInfo)
  }
}

/**
 * package包进入
 */
router.get('/', (req, res, next) => {
  let moduleName = req.baseUrl.replace('\/', '');
  if (!req.baseUrl) {
    moduleName = 'user';
  }
  const ret = getRenderData(moduleName);
  res.render('page', ret);
});

/**
 * 拦截package的页面
 */
router.get('*',  (req, res, next) => {
  const moduleName = req.baseUrl.replace('\/', '');
  if (!req.baseUrl) {
    next();
  } else {
    const {userInfo} = req
    const ret = getRenderData(moduleName, userInfo);
    res.render('page', ret);
  }
});

module.exports = router;
