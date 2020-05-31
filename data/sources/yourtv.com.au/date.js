const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const shortWeekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']


// Return date of next day after date
// const date = new Date(Date.parse('Wed, 09 Aug 1995')) 
// e.g nextDay(date, 0) returns Sun Aug 13 1995
function nextDay(date, day) {
    date = date || new Date()
    day = Number(day)
    if (!Number.isInteger(day) || day < 0 || day > 7)
        day = date.getDay()
    date = new Date(date.getTime())
    date.setDate(date.getDate() + 1 + (day+ 6 - date.getDay()) % 7)
    return date
}

// Return date of next day passed as 'Sun' - 'Sat', 'Sunday - 'Saturday'
function next(day) {
    const daynum = weekdays.indexOf(day) > -1 || shortWeekdays.indexOf(day.toUpperCase())
    return nextDay(null, daynum)
}

module.exports = {
    nextDay,
    next
}