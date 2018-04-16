module.exports = {
  success: (data, res) => {
    res.json({
      code: 1,
      msg: '成功',
      data
    })
  },
  error: (err, res) => {
    res.json({
      code: 0,
      msg: err.message || err,
      data: null
    })
  }
}
