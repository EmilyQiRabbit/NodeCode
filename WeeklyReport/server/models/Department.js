const mongoose = require('mongoose');
const Schema = mongoose.Schema
const {ObjectId, Number, String} = Schema.Types
const DepartmentSchema = new Schema({
  departmentName: {
    type: String,
    required: [true, '部门名称不能为空'],
    index: { unique: true },
    unique: true
  },
  departmentDesc: {
    type: String,
    default: ''
  },
  createTime: {
    type: Number,
    default: Date.now
  },
  updateTime: {
    type: Number,
    default: Date.now
  }
}, {
  versionKey: false
});

DepartmentSchema.virtual('key').get(() => this._id);
DepartmentSchema.set('toJSON', { virtuals: true });
DepartmentSchema.set('autoIndex', false)
DepartmentSchema.index({departmentName: 1})

const Department = mongoose.model('department', DepartmentSchema);
module.exports = Department

