const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const root = "public";
app.use(express.static(root));

// Keep track of connected users for each room code
const usersPerRoom = {};

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user registration with a code
  socket.on('register', (code) => {
    const room = io.sockets.adapter.rooms.get(code);

    if (!room || room.size < 2) {
      // Initialize the array for the room if it doesn't exist
      if (!usersPerRoom[code]) {
        usersPerRoom[code] = [];
      }

      let isTheFirstPlayer = false;

      if(!room) isTheFirstPlayer = true;

      // Add the user to the array for the room
      usersPerRoom[code].push(socket.id);

      console.log(`User with code ${code} registered`);

      // Join a room based on the code
      socket.join(code);

      // Notify all users in the room about the new registration
      io.to(code).emit('userRegistered', usersPerRoom[code]);
      if(isTheFirstPlayer) io.to(code).emit('waitForOpponent', code);
    } 
    else
    {
      console.log(`User with code ${code} rejected. Room is full.`);
      socket.emit('registrationRejected', 'Room is full. Try another code.');
    }
  });

  // Handle private messages
  socket.on('privateMessage', ({ code, message }) => {
  const targetSocketIds = usersPerRoom[code];

  // Check if the target sockets are available
  if (targetSocketIds && targetSocketIds.length === 2) {
    // Exclude the sender's socket ID
    const filteredTargetSocketIds = targetSocketIds.filter((targetSocketId) => targetSocketId !== socket.id);

    // Send the private message to the other user(s) in the room
    filteredTargetSocketIds.forEach((targetSocketId) => {
      io.to(targetSocketId).emit('privateMessage', { message, sender: socket.id });
    });
  }
});

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');

    // Remove the disconnected user from the array for their room
    Object.keys(usersPerRoom).forEach((code) => {
      usersPerRoom[code] = usersPerRoom[code].filter((userId) => userId !== socket.id);
      io.to(code).emit('userDisconnected');
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
