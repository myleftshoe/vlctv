const { 
    today, 
    tomorrow,
    next,
    day,
    getDay,
    toLowerCase,
    toUpperCase,
    convert,
} = require('./dates')

console.log(today)
console.log((day(tomorrow)))

console.log(convert(next(4), day))
console.log(getDay(next(4)))

convert(next(4))(toDayNames)(toLowerCase)
convert(next(4), toDayNames, toLowerCase)
convert(next(4), [toDayNames, toLowerCase])
convert(next(4), {to: [dayNames, lowerCase]})
convert({dates, to: [dayNames, lowerCase]})
const dayNames = getDay(next(4))
console.log(dayNames)

const days = ['today', 'tomorrow', ...getDay(next(4)).map(toLowerCase).slice(2)].slice(0,dayNames.length)
console.log(days)
