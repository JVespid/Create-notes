const path = require('path')

exports.ActionMain = async function (req, res) {
  res.sendFile(path.join(__dirname, '/../../dist/index.html'))
}
