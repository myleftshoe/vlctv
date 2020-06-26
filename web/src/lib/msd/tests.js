const { arrayOf, days, now, hours, weeks, today, format, formatfp, toDate } = require('.')

// const c0 = arrayOf(days).between(today - days * 2, today - days * 2 + days * 6).map(formatfp({ weekday: 'long' }))
// console.log(c0)

console.log(days)

const f1 = arrayOf({ days: 6 }, { weekday: 'long' }).from(today)
console.log(f1)

const f2 = arrayOf({ days: 6 }, toDate).from(today).map(formatfp({ weekday: 'long' }))
console.log(f2)

const f3 = arrayOf({ days: 6 }, toDate).from(today)
console.log(f3)

const f4 = arrayOf({ days: 6 }).from(today).map(toDate)
console.log(f4)

const f5 = arrayOf({ weeks: 4 }).from(today).map(toDate)
console.log(f5)

const f6 = format(now,  {weekday: 'long'})
console.log(f6)

const f7 = format(now,  toDate)
console.log(f7)

const b1 = arrayOf(days, { weekday: 'long' }).between(today, today + days * 7)
console.log(b1)


const a1 = toDate(today + weeks * 2 + days * 2)

console.log(a1)