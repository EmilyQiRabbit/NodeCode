const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Number} = Schema.Types
const ReportSchema = new Schema({
  //用户id
  userId: {
    type: ObjectId,
    required: true,
    ref: 'user'
  },
  //周数
  week: {
    type: Number,
    required: true
  },
  //年份
  year: {
    type: Number,
    required: true
  },
  //周报内容
  details: [{type: ObjectId, ref: 'detail'}],
  //周报发送产生的消息，一个收件人产生一条
  messages: [{type: ObjectId, ref: 'message'}],
  //周报状态，0未发送 1已发送
  status: {
    type: Number,
    default: 0
  },
  //创建时间
  createTime: {
    type: Number,
    default: Date.now()
  },
  //创建时间
  updateTime: {
    type: Number,
    default: Date.now()
  }
}, {
  versionKey: false
})
ReportSchema.index({updateTIme: -1})
ReportSchema.virtual('key', function () {
  return this._id
})
ReportSchema.set('toJSON', {virtuals: true})
ReportSchema.set('autoIndex', false)
ReportSchema.index({userId: 1, year: 1, week: 1, status: 1})

const Report = mongoose.model('report', ReportSchema)
module.exports = Report
