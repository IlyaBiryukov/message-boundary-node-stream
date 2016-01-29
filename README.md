# Split-Join-Stream

Break up a readable stream of messages separated by the delimiter, and reassemble it so that each write to the target stream is a whole message.
Read messages from the target stream, append the delimiter to them, and pipe that to the writable. Utf8 encoding is used to encode the delimiter.

Example, read messages separated by \0, and then writen them with \0 added.

```javascript
var PassThrough = require('stream').PassThrough;
var splitJoinStream = require('split-join-stream');

var target = new PassThrough();
var readable = new PassThrough();
var writable = new PassThrough();

var result = splitJoinStream(readable, target, writable, delimiter); // result === target.

readable.push('foo\0bar\0bazz\0');
readable.push('split');
readable.push('line\0');
readable.push('\0');
readable.push('one-line\0');
readable.push(null);

// target stream will get the following chunks:
// 'foo', 'bar', 'bazz', 'splitline', 'one-line'

// writable will get the following writes:
// 'foo\0', 'bar\0', 'bazz\0', 'splitline\0', 'one-line\0'
```

## Reading only (splitting)
If writable is null, then the behavior is the same as

```javascript
readable.pipe(split(delimiter, null, {trailing: false})).pipe(target);
```

## Writing only (joining)
If readable is null, then each chunk of data in target stream is written to writable with the trailing delimiter appended to it.
Utf8 encoding is used to encode the delimiter.

# License
MIT