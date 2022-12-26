const indexHtml = require('../actions/actionMain')

const app = require('express').Router()

app.get('/', indexHtml.ActionMain)

app.get('/Notes', indexHtml.ActionMain)

app.get('/Session', indexHtml.ActionMain)

module.exports = app
