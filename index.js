require('dotenv').config()
const express = require('express')
const cors = require('cors')
const route = require('./Routes/routes')
require('./Connections/db')
const http = require('http')

const server = express()
const httpServer = http.createServer(server)

server.use(cors())
server.use(express.json())
server.use(route)
server.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
