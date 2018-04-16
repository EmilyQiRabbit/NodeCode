//全局业务配置
const {SSO_URL, UC_URL, PASSPORT_URL} = process.env;

module.exports = {
  pageSize: 10,
  privateKey: 'ZMK1@4V6B7C#D3F!',
  secret: 'bkjk_pin',
  defaultAdmin: ['yuqi.liu@bkjk.com'], //默认管理员邮箱,用于配置权限
  apis: {
    validateToken: `${PASSPORT_URL}checkToken`,
    getAuthority: `${UC_URL}api/permission/queryByRoleIdsAndAppIds`
  }
};
