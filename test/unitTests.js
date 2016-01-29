/* global it */
/* global describe */

var should = require('should');
var PassThrough = require('stream').PassThrough;
var splitJoinStream = require('../');

describe('splitJoinStream', function () {
    it('Should throw if both readable and writeable are undefined', function () {
        should.throws(function() {
            splitJoinStream(null, new PassThrough());
         });
    });

    it('Should throw if delimiter is empty string', function () {
        should.throws(function() {
            splitJoinStream(new PassThrough(), new PassThrough(), new PassThrough(), '');
         });
    });

    it('Should throw if target is not defined', function () {
        should.throws(function() {
            splitJoinStream(new PassThrough(), null, new PassThrough(), '\0');
         });
    });

    it('Should split the readable, pipe that to the target, append the delimiter back and pipe that to writeable', function (done) {
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

        var result = splitJoinStream(readable, target, writeable, delimiter);
        target.should.equal(result);

        readable.push('foo' + delimiter + 'bar' + delimiter + 'bazz' + delimiter);
        readable.push('split');
        readable.push('line' + delimiter);
        readable.push(delimiter);
        readable.push('one-line' + delimiter);
        readable.push(null);
    });

    it('Should be able to work without writeable and with default delimiter', function (done) {
        var target = new PassThrough();
        var readable = new PassThrough();
        var defaultDelimiter = '\0';

        var targetData = [];

        target.on('data', function (data) { targetData.push(data.toString()); });
        target.on('finish', function() {
            targetData.should.eql(
                ['foo', 'bar', 'bazz', 'splitline', 'one-line'],
                'Target gets non-empty messages without delimiters');
            done();
        });

        var result = splitJoinStream(readable, target);
        target.should.equal(result);

        readable.push('foo' + defaultDelimiter + 'bar' + defaultDelimiter + 'bazz' + defaultDelimiter);
        readable.push('split');
        readable.push('line' + defaultDelimiter);
        readable.push(defaultDelimiter);
        readable.push('one-line' + defaultDelimiter);
        readable.push(null);
    });

    it('Should be able to work without readable', function (done) {
        var target = new PassThrough();
        var writeable = new PassThrough();
        var delimiter = '\r\n';

        var writeableData = [];

        writeable.on('data', function (data) { writeableData.push(data.toString())});
        writeable.on('finish', function() {
            writeableData.should.eql(
                ['foo' + delimiter, 'bar' + delimiter],
                'Writeable gets writes with delimiters');
            done();
        });

        var result = splitJoinStream(null, target, writeable, delimiter);
        target.should.equal(result);

        target.push('foo');
        target.push('bar');
        target.push(null);
    });

});