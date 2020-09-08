const http = require('http')
const path = require('path')

const socketio = require('socket.io')
const express = require('express')
const Filter = require('bad-words')

const { generateMsg, generateLocationMsg } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

port = process.env.PORT || 3000
const app = express();
const server = http.createServer(app)     /// happened behind the scene when not called         
const io = socketio(server)

// Define paths for express to configure
const PublicDir = path.join(__dirname, '../public');
/// To serve this Bublic File!
app.use(express.static(PublicDir))

io.on('connection', (socket) => {
    console.log('Setup New io Connection')

    socket.on('join', ({ username, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('sending message', generateMsg('Admin ', `${user.username}, Welcome To The Chat App!`))
        socket.to(user.room).broadcast.emit('sending message', generateMsg('Admin ', `${user.username} Has Joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })



    socket.on('sending message', (message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('No Bad words Are Alowed')
        }

        io.to(user.room).emit('sending message', generateMsg(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if (user)
            io.to(user.room).emit('locationMessage', generateLocationMsg(user.username, coords))
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('sending message', generateMsg('Admin ', `${user.username} Has Left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


server.listen(port, () => {
    console.log('Starting server in port ', port)
})