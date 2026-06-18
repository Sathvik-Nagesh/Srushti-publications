const assert = require('assert');

function validateMagic(buffer) {
    const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isGif = buffer.length >= 4 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
    const isWebp = buffer.length >= 12 &&
                   buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
                   buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

    return isJpeg || isPng || isGif || isWebp;
}

assert(validateMagic(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))); // JPEG
assert(validateMagic(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]))); // PNG
assert(validateMagic(Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]))); // GIF
assert(validateMagic(Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]))); // WEBP
assert(!validateMagic(Buffer.from([0x00, 0x00, 0x00, 0x00]))); // Invalid
console.log("All tests passed");
