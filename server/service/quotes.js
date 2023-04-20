const { randomValue } = require('../utils/randomValue');
const { getUTCDate } = require('../utils/getUTCDate');

const tickers = [
    'AAPL', // Apple
    'GOOGL', // Alphabet
    'MSFT', // Microsoft
    'AMZN', // Amazon
    'FB', // Facebook
    'TSLA', // Tesla
];

const createQuotes = () => {
    return tickers.map(ticker => ({
        ticker,
        startPrice: randomValue(100, 300, 2),
        exchange: 'NASDAQ',
    }));
};

const quotes = createQuotes();

const getQuotes = () => quotes;

const changeQuotes = () => {
    for (const quote of quotes) {

        const { startPrice } = quote;
        const change = randomValue(-startPrice * 0.05, startPrice * 0.05, 2);
        const endPrice = parseFloat((startPrice + change).toFixed(2));

        quote.price = endPrice;
        quote.change = change;
        quote.change_percent = parseFloat((change / startPrice).toFixed(4));
        quote.dividend = randomValue(0, 1, 2);
        quote.yield = randomValue(0, 2, 2);
        quote.last_trade_time = getUTCDate();
    };
};

module.exports = {
    getQuotes,
    changeQuotes,
};