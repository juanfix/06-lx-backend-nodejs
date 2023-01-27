import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { PORT } from './config.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(morgan('dev'));

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('message', (message) => {
    console.log(message);
    socket.broadcast.emit('message', {
      body: message,
      from: socket.id,
    });
  });
});

app.use(express.static(join(__dirname, '../client/dist')));

server.listen(PORT);
console.log('Server started on port', PORT);
