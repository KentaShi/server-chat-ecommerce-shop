const express = require("express")
const app = express()
const cors = require("cors")
const http = require("http")
const server = http.createServer(app)
const socketio = require("socket.io")
const io = socketio(server)

const PORT = process.env.PORT || 8000

app.use(cors({ origin: "*" }))

server.listen(PORT, () => {
    console.log("Server Chat is listening on port " + PORT)
})
