/** ************************************************************************
 *
 * A set of utility primitives to read an ArrayBuffer.
 *
 * _.js is just a literal object that contains a set of functions. It
 * can't be intantiated.
 *
 * Private Functions:
 *  . _readUTF8String             returns an UTF-8 string,
 *
 *
 * Public Static Methods:
 *  . readString                  Returns an ASCII string,
 *  . readUTF8String              returns an UTF-8 string,
 *  . readUInt8                   returns an unigned byte,
 *  . readUInt16LE                returns an unsigned little endian 16 bits number,
 *  . readUInt32LE                returns an unsigned little endian 32 bits number,
 *  . readUInt32BE                returns an unsigned big endian 32 bits number,
 *  . readDoubleLE                returns an little endian floating point number,
 *
 *
 *
 * @namespace    SHP.src.lib._
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ********************************************************************** */
/* global */
/* eslint-disable one-var, semi-style, no-underscore-dangle */


// -- Vendor Modules


// -- Local modules


// -- Local constants


// -- Local variables


// -- Private Functions ----------------------------------------------------

/**
 * Returns an UTF-8 string.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Array}           the array buffer,
 * @param {Number}          the first included buffer item,
 * @param {Number}          the first excluded buffer item,
 * @throws {Error}          throws an error if it isn't an utf-8 data,
 * @returns {String}        returns the UTF-8 string,
 * @since 0.0.0
*/
/* eslint-disable no-bitwise */
function _readUTF8String(buf, start, stop) {
  const len = stop - start;
  let s = ''
    , i = 0
    , c
    , c1
    , c2
    ;

  while (i < len) {
    c = buf[start + i];

    if (c < 128) {
      s += String.fromCharCode(c);
      i += 1;
    } else if (c > 191 && c < 224) {
      if (i + 1 >= len) {
        throw new Error(
          'UTF-8 Decode failed. Two byte character was truncated.',
        );
      }
      c1 = buf[start + i + 1];
      s += String.fromCharCode(((c & 0x1f) << 6) | (c1 & 0x3f));
      i += 2;
    } else {
      if (i + 2 >= len) {
        throw new Error(
          'UTF-8 Decode failed. Two byte character was truncated.',
        );
      }
      c1 = buf[start + i + 1];
      c2 = buf[start + i + 2];
      s += String.fromCharCode(((c & 0x0f) << 12) | ((c1 & 0x3f) << 6) | (c2 & 0x3f));
      i += 3;
    }
  }
  return s;
}
/* eslint-enable no-bitwise */


// -- Public Static Methods ------------------------------------------------

const underscore = {

  /**
   * Returns an ASCII string.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Array}         the array buffer,
   * @param {Number}        the first buffer item,
   * @param {Number}        the first excluded buffer item,
   * @returns {String}      returns an ascii string,
   * @since 0.0.0
  */
  /* eslint-disable no-control-regex */
  readString(buf, start, stop) {
    let s = '';
    for (let i = start; i < stop; i++) {
      s += String.fromCharCode(buf[i]);
    }
    return s.replace(/\u0000/g, '');
  },
  /* eslint-enable no-control-regex */

  /**
   * Returns an UTF-8 string.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Array}         the array buffer,
   * @param {Number}        the first buffer item,
   * @param {Number}        the first excluded buffer item,
   * @throws {Error}        throws an error if it isn't an utf-8 data,
   * @returns {String}      returns the UTF-8 string,
   * @since 0.0.0
  */
  readUTF8String(buf, start, stop) {
    return _readUTF8String(buf, start, stop);
  },

  /**
   * Returns an unigned byte.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}       the buffer array,
   * @param {Number}      the first item in the buffer array,
   * @returns {Number}    returns a number,
   * @since 0.0.0
   */
  readUInt8(buf, pos) {
    return buf[pos];
  },

  /**
   * Returns an unsigned little endian 16 bits number.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         the buffer array,
   * @param {Number}        the first item in the buffer array,
   * @returns {Number}      returns a number,
   * @since 0.0.0
   */
  readUInt16LE(buf, pos) {
    return (buf[pos + 1] * (2 ** 8)) + buf[pos];
  },

  /**
   * Returns an unsigned little endian 32 bits number.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         the buffer array,
   * @param {Number}        the first item in the buffer array,
   * @returns {Number}      returns a number,
   * @since 0.0.0
   */
  readUInt32LE(buf, pos) {
    return (buf[pos + 3] * (2 ** 32))
      + (buf[pos + 2] * (2 ** 16))
      + (buf[pos + 1] * (2 ** 8))
      + buf[pos];
  },

  /**
   * Returns an unsigned big endian 32 bits number.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         the buffer array,
   * @param {Number}        the first item in the buffer array,
   * @returns {Number}      returns a number,
   * @since 0.0.0
   */
  readUInt32BE(buf, pos) {
    return (buf[pos] * (2 ** 32))
      + (buf[pos + 1] * (2 ** 16))
      + (buf[pos + 2] * (2 ** 8))
      + buf[pos + 3];
  },

  /**
   * Returns an little endian floating point number.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         the buffer array,
   * @param {Number}        the first item in the buffer array,
   * @returns {Number}      returns a number,
   * @since 0.0.0
   */
  readDoubleLE(buf, pos) {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);

    for (let i = 0; i < 8; i++) {
      view.setUint8(7 - i, buf[pos + i]);
    }
    return view.getFloat64(0);
  },
};


// -- Export
export default underscore;

/* eslint-enable one-var, semi-style, no-underscore-dangle */
