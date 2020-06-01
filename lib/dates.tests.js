const { today, tomorrow, next } = require('./dates')
const { convert, to, toDays, toLowerCase, toMilliseconds } = require('./dates/convert')

console.log(today)
console.log(tomorrow)
console.log(convert(next(4), toDays, toLowerCase))
console.log(convert(next(4), to('cccc'), toLowerCase))
console.log(convert(new Date(), toDays, toLowerCase))
console.log(convert(next(3), toMilliseconds))

