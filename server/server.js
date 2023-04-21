'use strict';
const express = require('express');
const http = require('http');
const io = require('socket.io');
const cors = require('cors');
const { getRandomQuotes, initialChangeQuotes } = require('./service/quotes');

const FETCH_INTERVAL = 2000;
const PORT = process.env.PORT || 4000;

function sendChangedQuotes(socket) {
  const changedQuotes = getRandomQuotes();

  socket.emit('ticker', changedQuotes);
}

function sendInitialQuotes(socket) {
  const initialQuotes = initialChangeQuotes();

  socket.emit('ticker', initialQuotes);
}

function trackTickers(socket) {
  // run the first time immediately
  sendInitialQuotes(socket);

  // every N seconds
  const timer = setInterval(function() {
    sendChangedQuotes(socket);
  }, FETCH_INTERVAL);

  socket.on('disconnect', function () {
    clearInterval(timer);
  });
}

const app = express();
app.use(cors());
const server = http.createServer(app);

const socketServer = io(server, {
  cors: {
    origin: "*",
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

socketServer.on('connection', (socket) => {
  socket.on('start', () => {
    trackTickers(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Streaming service is running on http://localhost:${PORT}`);
});
