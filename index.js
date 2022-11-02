const log4js = require('log4js')
const http = require('http')
const https = require('https')
const fs = require('fs')
const socketIo = require('socket.io')
const express = require('express')
const serveIndex = require('serve-index')

const USERCOUNT = 3

log4js.configure({
  appenders: { file: { type: 'file', filename: 'app.log', 
    layout: {
      type: 'pattern',
      pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %p - %m',
    }
  } },
  categories: { default: { appenders: ['file'], level: 'debug' } },
})
const logger = log4js.getLogger()

const app = express()

app.use(serveIndex('./public'))
app.use(express.static('./public'))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'content -type')
  res.header('Access-Control-Allow-Methods', 'DELETE ,PUT ,POST ,GET ,OPTIONS')
  if (req.method.toLowerCase() == 'options ') {
    res.send(200)
  } else {
    next()
  }
})

const httpServer = http.createServer(app)
httpServer.listen(8080, '0.0.0.0')

const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
}
const httpsServer = https.createServer(options, app)
const io = socketIo.listen(httpsServer)

io.sockets.on('connection', (socket) => {
  socket.on('message', (room, data) => {
    console.log('message , room: ' + room + ", data , type:" + data.type)
    logger.debug('message , room: ' + room + ", data , type:" + data.type)
    socket.to(room).emit('message', room, data)
  })

  socket.on('join', (room) => {
    socket.join(room)
    var myRoom = io.sockets.adapter.rooms[room]
    var users = (myRoom) ? Object.keys(myRoom.sockets).length : 0

    console.log('the user number of room (' + room + ') is: ' + users)
    logger.debug('the user number of room (' + room + ') is: ' + users)

    if (users < USERCOUNT) {
      socket.emit('joined', room, socket.id)

      if (users > 1) {
        socket.to(room).emit('otherjoin', room, socket.id)
      }
    } else {
      socket.leave(room)
      socket.emit('full', room, socket.id)
    }
  })

  socket.on('leave', (room) => {

    socket.leave(room)

    var myRoom = io.sockets.adapter.rooms[room]
    var users = (myRoom) ? Object.keys(myRoom.sockets).length : 0
    logger.debug('the user number of room is: ' + users)

    socket.to(room).emit('bye', room, socket.id)

    socket.emit('leaved', room, socket.id)

  })
})

httpsServer.listen(8081, '0.0.0.0')