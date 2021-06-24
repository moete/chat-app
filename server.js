const express = require('express');
const app = express();

const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./public/utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./public/utils/users');

//Set static folder 
app.use(express.static(path.join(__dirname, 'public')));
//Run when client connects 




const botName = 'ChatCord Bot';
// Run when client connect

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id,username,room) ;
        
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'welcome to chatCord'))

        console.log('New client connection');
        //Welcome current user
        socket.emit('message', formatMessage(botName, 'welcome to chatRoom '));
        // Broadcast when user connects 
        socket.broadcast
        .to(user.room)
        .emit(
            'message',
            formatMessage(botName, `${user.username}  has joined the chatRoom`)
        )
        //send users and room info 
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });

    })
    //Listen for chat messages 
    socket.on('chatMessage', (msg) => {
          const user = getCurrentUser(socket.id) ;
          console.log(msg);
          io.to(user.room).emit('message', formatMessage(user.username,msg));
          outputMessage(msg)
        })
      // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

});
   


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
