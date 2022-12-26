const path = require('path')

const app = require('express').Router()

app.get('/', async function (req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

app.get('/Notes', async function (req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

app.get('/Session', async function (req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

module.exports = app
