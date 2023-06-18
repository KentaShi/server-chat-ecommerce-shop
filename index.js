const io = require("socket.io")(8000, {
    cors: {
        origin: "http://localhost:5000",
    },
})

let users = []
const addUser = (userId, socketId, admin) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId, admin })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

const connectedUsers = {}

io.on("connection", (socket) => {
    // TODO: determine the user's role (admin or user)
    const isAdmin = socket.handshake.query.isAdmin === "true"

    // TODO: Store the connected user's socket base on their role
    connectedUsers[isAdmin ? "admin" : "user"] = socket

    if (isAdmin) {
        console.log("Admin connected")
    } else {
        console.log("Regular user connected")
    }

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id, isAdmin)
    })

    // TODO: Send and receive a message to a specific user
    socket.on(
        "message",
        ({ sender, content, conversationID, receiver }, callback) => {
            const user = getUser(receiver)

            io.to(user.socketId).emit("getMessage", {
                sender,
                content,
                conversationID,
            })

            callback()
        }
    )

    // if (isAdmin) {
    //     console.log("Admin connected")

    //     // TODO: Send a message to a specific user
    //     socket.on(
    //         "message",
    //         ({ sender, content, conversationID, receiver }, callback) => {
    //             const userSocket = connectedUsers.user

    //             const user = getUser(receiver)
    //             if (userSocket) {
    //                 io.to(user.socketId).emit(`${conversationID}`, {
    //                     sender,
    //                     content,
    //                     conversationID,
    //                 })
    //             }
    //             callback()
    //         }
    //     )
    // } else {
    //     console.log("Regular user connected")

    //     // TODO: Send a message to admin
    //     socket.on(
    //         "message",
    //         ({ sender, content, conversationID, receiver }, callback) => {
    //             const adminSocket = connectedUsers.admin
    //             const user = getUser(receiver)
    //             if (adminSocket) {
    //                 io.to(user.socketId).emit(`${conversationID}`, {
    //                     sender,
    //                     content,
    //                     conversationID,
    //                 })
    //             }
    //             callback()
    //         }
    //     )
    // }

    socket.on("disconnect", () => {
        // TODO: Remove the user from the list of connected users
        const userRole = isAdmin ? "Admin" : "User"
        delete connectedUsers[userRole]
        removeUser(socket.id)
        console.log(`${userRole} disconnected`)
    })
})
