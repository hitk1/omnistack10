const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const app = express()

mongoose.connect('mongodb://127.0.0.1/devRdar', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected', () => { console.log('Banco de dados conectado com sucesso')})

app.use(express.json())
app.use(routes)

app.listen(3333)