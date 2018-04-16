//services
const isDev = process.env.NODE_ENV === 'development';
//加载webpack打包后的静态文件映射表
const fileMapping = process.env.NODE_ENV === 'development' ? null : require('../../public/static/mapping.json');

/**
 * 构建样式列表
 * @param key
 */
exports.getCss = function (key) {
  const buildLink = function (href) {
    return `<link href="${href}" rel="stylesheet">`;
  };
  if (!isDev) {
    return `${buildLink(fileMapping[`${key}.css`])}`;
  }else{
    return '';
  }
};

/**
 * 获取js列表
 * @param key
 */
exports.getJs = function (key) {

  console.log(key,'-------------')
  const buildScript = function (src) {
    return `<script src="${src}"></script>`;
  };
  if (isDev) {
    return `${buildScript('/public/dll/vendor.dll.js')}
         ${buildScript(`/public/static/${key}.bundle.js`)}`;
  } else {
    return `${buildScript(fileMapping['manifest.js'])}
        ${buildScript(fileMapping['vendor.js'])}
        ${buildScript(fileMapping['${key}.js'])}`;
  }
};
