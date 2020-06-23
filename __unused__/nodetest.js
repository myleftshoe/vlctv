var fs = require('fs'),
    xml2js = require('xml2js');


Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function () {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
            pad2(this.getMonth() + 1) +
            pad2(this.getDate()) +
            pad2(this.getHours()) +
            pad2(this.getMinutes()) +
            pad2(this.getSeconds());
    }
});


const now = new Date().YYYYMMDDHHMMSS()
// console.log(now.substr(0,8))


var parser = new xml2js.Parser({ mergeAttrs: true });
fs.readFile(__dirname + '/Melbourne.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        // console.log(JSON.stringify(result));
        // console.log(result.tv.programme)
        const programs  = result.tv.programme;
        const tv = programs.filter(program => {
            // toISOString().substr(0,10);            
            return (program.category[0] !== 'Radio')
        }).map(program => {
            return {
                channel: program.channel[0].split('.')[0],
                title: program.title[0],
                desc: program.desc && program.desc[0],
                start: program.start[0],
                stop: program.stop[0].substr(0,14)
            }

        })
        // console.log(tv, tv.length)
        console.log(JSON.stringify(tv))
    });
});

