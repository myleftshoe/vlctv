module.exports = {
    get now() { return Date.now() },
    get today() { return new Date().setHours(0, 0, 0, 0) },
}
