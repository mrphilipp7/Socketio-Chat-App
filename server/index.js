const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = 3007;

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

//user connects
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  //user joins a room
  socket.on("join", (data) => {
    socket.join(data);
    console.log(`User: ${socket.id} joined room: ${data}`);
  });

  //user disconnects
  socket.on("disconnect", () => {
    console.log("connection disconnected", socket.id);
  });

  //user sends message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(PORT, () => {
  console.log(`*** Express server listening on http://localhost:${PORT}/ ***`);
});
