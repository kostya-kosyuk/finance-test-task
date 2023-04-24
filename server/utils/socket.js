const { getRandomQuotes, initialChangeQuotes } = require('./service/quotes');

const FETCH_INTERVAL = 5000;
let currentTimer = null;

function sendChangedQuotes(socket) {
    const changedQuotes = getRandomQuotes();

    socket.emit('ticker', changedQuotes);
}

function sendInitialQuotes(socket) {
    const initialQuotes = initialChangeQuotes();

    socket.emit('ticker', initialQuotes);
}

function trackTickers(socket, interval = FETCH_INTERVAL) {
    // run the first time immediately
    sendInitialQuotes(socket);

    clearInterval(currentTimer);

    // every N seconds
    const timer = setInterval(function () {
        sendChangedQuotes(socket);
        console.log(interval);
    }, interval);

    currentTimer = timer;

    socket.on('disconnect', function () {
        clearInterval(timer);
    });
}

module.exports = {
    trackTickers
};