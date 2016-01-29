/* global Buffer */

var split = require('split');
var Transform = require('stream').Transform;

function splitJoinStream(readable, target, writable, delimiter) {
    var delimiterBuffer = new Buffer(delimiter);

    readable.pipe(split(delimiter, null, {trailing: false})).pipe(target).pipe(new Transform({transform: addDelmiter})).pipe(writable);

    function addDelmiter(chunk, enc, cb) {
        cb(null, Buffer.isBuffer(chunk) ? Buffer.concat([chunk, delimiterBuffer]) : chunk.concat(delimiter));
    }
}

module.exports = splitJoinStream;