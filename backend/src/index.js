const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { setUpWebSocket } = require('./websocket')
const routes = require('./routes')

const app = express()
const server = http.Server(app)

setUpWebSocket(server)

mongoose.connect('mongodb://127.0.0.1/devRdar', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected', () => { console.log('Banco de dados conectado com sucesso')})

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(3333)