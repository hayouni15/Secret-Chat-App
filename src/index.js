const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const timestamp = require('time-stamp');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
var Filter = require('bad-words'),
    filter = new Filter();

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000


app.use(express.static(publicDirPath))

/////// routing ////////
// index 
app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', (socket) => {


    socket.on('msg', (data, callback) => {
        if (filter.isProfane(data)) {
            return callback('profanity is not allowed')
        }
        const user=getUser(socket.id);
        socket.broadcast.to(user.room).emit('message', { message: data, time: `${timestamp('HH')} : ${timestamp('mm')}`,sender:user.username })
        callback(`${timestamp('HH')} : ${timestamp('mm')}`)
    })


    socket.on('join', (data, callback) => {
      
        const { error, user } = addUser({ id: socket.id, room: data.room, username: data.username })
        console.log('error:', error, 'user:',user , 'data',data)
        if (error) {
            console.log(error,'!!!!')
            return callback({error,user:undefined})
        }
        socket.join(data.room)
        socket.emit('message', { message: 'Welocome', time: `${timestamp('HH')} : ${timestamp('mm')}` })
        io.to(data.room).emit('list', getUsersInRoom(data.room))
        socket.broadcast.emit('message', { message: `${data.username} has joined `, time: `${timestamp('HH')} : ${timestamp('mm')}` })
        callback({error:undefined,user:data.username})
    })


    socket.on('location', (data, callback) => {
        const user=getUser(socket.id)
        socket.broadcast.to(user.room).emit('location', {data,user:user.username})
        callback('location received')
    })


    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })

    socket.on('disconnect', async() => {
        const Theuser = await removeUser(socket.id)
    
        if (Theuser) {
            console.log('removed:' ,Theuser)
            io.to(Theuser[0].room).emit('message', { message: `${Theuser[0].username} has left`, time: `${timestamp('HH')} : ${timestamp('mm')}` })
        }
    })

})

/////// !routing ///////


server.listen(port, () => {
    console.log(`App listening on port${port}`)
})