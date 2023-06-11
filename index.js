const express = require("express")
const app = express()
const cors = require("cors")
const http = require("http")
const server = http.createServer(app)
const socketio = require("socket.io")
const io = socketio(server)

const PORT = process.env.PORT || 8000

app.use(cors({ origin: "*" }))

const connectedUsers = {}
io.on("connection", (socket) => {
    // TODO: determine the user's role (admin or user)
    const isAdmin = socket.handshake.query.isAdmin === "true"

    // TODO: Store the connected user's socket base on their role
    connectedUsers[isAdmin ? "admin" : "user"] = socket

    if (isAdmin) {
        console.log("Admin connected")

        // TODO: Send a message to a specific user
        socket.on("message", (data, callback) => {
            const userSocket = connectedUsers.user
            if (userSocket) {
                userSocket.emit("message", data)
            }
            callback()
        })
    } else {
        console.log("Regular user connected")

        // TODO: Send a message to admin
        socket.on("message", (data, callback) => {
            const adminSocket = connectedUsers.admin
            if (adminSocket) {
                adminSocket.emit("message", data)
            }
            callback()
        })
    }

    socket.on("disconnect", () => {
        // TODO: Remove the user from the list of connected users
        const userRole = isAdmin ? "admin" : "user"
        delete connectedUsers[userRole]
        console.log(`${userRole} disconnected`)
    })
})

server.listen(PORT, () => {
    console.log("Server Chat is listening on port " + PORT)
})
