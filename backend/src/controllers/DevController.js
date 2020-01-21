const axios = require('axios')
const Dev = require('../models/Dev')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {

    async store(req, resp) {
        const { github_username, techs, latitude, longitude } = req.body

        let dev = await Dev.findOne({ github_username })

        if (!dev) {

            const response = await axios.get(`https://api.github.com/users/${github_username}`)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            const { name = login, avatar_url, bio } = response.data

            dev = await Dev.create({ github_username, name, avatar_url, bio, techs, location })

            //Filtrar as conexões que estão a no máximo 10km de distancia e que o novo dev tenha pelo menos 1 das techs filtradas

            const sendSocketMessageTo = findConnections( { latitude, longitude}, techs )

            
            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }

        return resp.json(dev)
    },

    async index(req, resp){
        const devs = await Dev.find({})

        return resp.json(devs)
    }
}