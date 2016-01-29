/* global Buffer */

var split = require('split');
var Transform = require('stream').Transform;

function splitJoinStream(readable, target, writable, delimiter) {
    var delimiterBuffer;

    if (!readable && !writable) {
        throw new Error('readable and writeable are both not defined. At least one of them should be specified.');
    }

    if (!target) {
        throw new Error('target is not defined');
    }

    if (delimiter === undefined) {
        delimiter = '\0';
    }
    else if (delimiter === '') {
        throw new Error('delimiter cannot be an empty string');
    }

    if (readable) {
        readable.pipe(split(delimiter, null, {trailing: false})).pipe(target);
    }

    if (writable) {
        delimiterBuffer = new Buffer(delimiter);
        target.pipe(new Transform({transform: addDelmiter})).pipe(writable);
    }

    return target;

    function addDelmiter(chunk, enc, cb) {
        var newChunk = Buffer.isBuffer(chunk) ? Buffer.concat([chunk, delimiterBuffer]) : chunk.concat(delimiter);
        cb(null, newChunk);
    }
}

module.exports = splitJoinStream;