function randomValue(min = 0, max = 1, precision = 0) {
    const random = Math.random() * (max - min) + min;
    return Number(random.toFixed(precision));
}

module.exports = {
    randomValue
};