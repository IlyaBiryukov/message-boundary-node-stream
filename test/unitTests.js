/* global it */
/* global describe */

var should = require('should');
var PassThrough = require('stream').PassThrough;
var splitJoinStream = require('../');

describe('splitJoinStream', function () {
    it('Should add delimiters', function (done) {
        var target = new PassThrough();
        var readable = new PassThrough();
        var writeable = new PassThrough();
        var delimiter = '\0';

        var targetData = [];
        var writeableData = [];

        target.on('data', function (data) { targetData.push(data.toString()); });
        writeable.on('data', function (data) { writeableData.push(data.toString())});
        writeable.on('finish', function() {
            targetData.should.eql(
                ['foo', 'bar', 'bazz', 'splitline', 'one-line'],
                'Target gets non-empty messages without delimiters');
            writeableData.should.eql(
                ['foo' + delimiter, 'bar' + delimiter, 'bazz' + delimiter, 'splitline' + delimiter, 'one-line' + delimiter],
                'Writeable gets writes with delimiters');
            done();
        });

        splitJoinStream(readable, target, writeable, delimiter);

        readable.push('foo' + delimiter + 'bar' + delimiter + 'bazz' + delimiter);
        readable.push('split');
        readable.push('line' + delimiter);
        readable.push(delimiter);
        readable.push('one-line' + delimiter);
        readable.push(null);
    });
});