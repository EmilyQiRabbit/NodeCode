const mongoose = require('mongoose'),
  dataApi = require('./common');

const EMAIL = /^['_A-Za-z0-9-]+(\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$/;

/* wm_posts table structure
 --------------------------------------------
 - email : 用户邮箱
 - nickName : 用户昵称
 - user_password : 用户密码
 - user_status : 用户状态, 0正常状态 -1禁用
 - user_role : 用户权限, 0是普通用户 1是管理员
 - createTime : 注册时间
 --------------------------------------------
 */

const UserSchema = new mongoose.Schema({
  /**
   * 用户邮箱
   */
  email: {
    type: String,
    validate: [
        {
          validator: (val) => {
            return EMAIL.test(val);
          },
          msg: '请输入正确的邮箱格式'
        }
    ],
    required: [true, '邮箱不能为空'],
    index: true,
    unique: true
  },

  /**
   * 用户真实姓名
   */
  userName: {
    type: String,
    required: [true, '真实姓名不能为空']
  },

  /**
   * 用户密码
   */
  password: {
    type: String,
    required: [true, '密码不能为空']
  },

  /**
   * 用户昵称
   */
  nickName: {
    type: String,
    default: '',
  },

  /**
   * 默认为1,普通用户
   */
  user_role: {
    type: Number,
    default: 1,
    enum: [1, 999]
  },

  /**
   * 用户状态,默认没有激活
   */
  user_status: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },

  /**
   * 注册时间
   */
  createTime: {
    type: Number,
    default: Date.now()
  },

  // 用户编码
  // userCode: {
  //   type: String,
  //   required: [true, '员工系统号不能为空'],
  //   index: true,
  //   unique: true
  // },
  //微信号
  wechat: {
    type: String,
    default: ''
  },
  //微信申请绑定时账号的union id
  wechatCode: {
    type: String,
    default: ''
  },
  //微信账号激活状态 0未激活 1激活
  wechatActive: {
    type: Number,
    default: 0
  },
  // 账户名称
  // account: {
  //   type: String,
  //   index: true,
  //   required: [true, '员工账户名不能为空']
  // },
  // 手机号码
  mobile: {
    type: String,
    index: true,
    required: [true, '手机号不能为空']
  },
  //头像链接
  avatar: String,
  //签名
  signature: {
    type: String,
    default: ''
  },
  //是否开启签名
  signatureEnable: {
    type: Boolean,
    default: false
  },
  // 机构id
  departmentId: {
    type: String,
    default: ''
  },
  // 机构名称
  departmentName: {
    type: String,
    default: ''
  },
  //更新时间
  updateTime: {
    type: Number,
    default: Date.now()
  },
  //微信申请绑定的时间
  applyTime: {
    type: Number,
    default: Date.now()
  }
});

dataApi(UserSchema, 'user');
UserSchema.virtual('key').get(function () {
  return this._id
})
UserSchema.index({createTime: -1})
UserSchema.set('toJSON', {virtuals: true})
UserSchema.set('autoIndex', false)
UserSchema.index({email: 1, userName: 1, user_role: 1, user_status: 1})

module.exports = mongoose.model('user', UserSchema);
