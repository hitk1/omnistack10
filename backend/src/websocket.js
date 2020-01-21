const socketio = require('socket.io')
const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

let io
const connections = []

exports.setUpWebSocket = (server) => {
    io = socketio(server)

    io.on('connection', socket => {
        //console.log(socket.handshake.query)     //Parametros recebidos através do socket
        const { latitude, longitude, techs } = socket.handshake.query

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs)
        })

        console.log(`Client ${socket.id} connected`)
    })
}

exports.findConnections = (coordinates, techs) => {
    let resp = connections.filter(conn => {
        let distance = calculateDistance(coordinates, conn.coordinates) < 20000     //Calculo esta com problema
            && conn.techs.some(item => techs.includes(item))
        return distance
    })
    return resp
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)
    })
}