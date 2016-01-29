// Type definitions for split-join-stream 1.0.4
// Project: https://github.com/IlyaBiryukov/message-boundary-node-stream
// Definitions by: Ilya Biryukov <https://github.com/IlyaBiryukov>

declare module 'split-join-stream' {

    /** Break up a readable stream of messages separated by the delimiter, and reassemble it so that each write to the target stream is a whole message.
     *  Read messages from the target stream, append the delimiter to them, and pipe that to the writeable. Utf8 encoding is used to encode the delimiter.
     */
    function splitJoinStream(
        readable: NodeJS.ReadableStream,
        target: NodeJS.ReadWriteStream,
        writeable?: NodeJS.WriteableStream,
        delimiter?: string): NodeJS.ReadWriteStream;

    export = splitJoinStream;
}