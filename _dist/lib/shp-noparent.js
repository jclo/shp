/*! ****************************************************************************
 * SHP v0.0.1
 *
 * A library for reading Natural Earth's SHP files.
 * (you can download it from npm or github repositories)
 * Copyright (c) 2019 Mobilabs <contact@mobilabs.fr> (http://www.mobilabs.fr).
 * Released under the MIT license. You may obtain a copy of the License
 * at: http://www.opensource.org/licenses/mit-license.php).
 * ************************************************************************** */
// Based on ES6.lib template v0.0.5
// ESLint declarations
/* global define */
/* eslint strict: ["error", "function"] */
(function(root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([''], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(root);
    // This is a hack to attach the lib to the browser root when this lib is
    // included inside another lib and the whole is browserifyied:
    /* eslint-disable-next-line no-param-reassign */
    if (!root.SHP) root.SHP = factory(root);
  } else {
    // Browser globals.
    /* eslint-disable-next-line no-param-reassign */
    root.SHP = factory(root);
  }
}({{lib:parent}}, (root) => {
  // This is the list of the constants that are defined at the global level of
  // this module and are accessible to all. So, they are considered as reserved
  // words for this library.
  /* eslint-disable one-var, semi-style */
  let SHP
    , _
    ;
  /* eslint-enable one-var, semi-style */

  /* ***************************************************************************
   *
   * Tree is an internal object that links all the internal modules.
   *
   * tree.js is just a literal object that contains a set of functions. It
   * can't be intantiated.
   *
   *
   * @namespace SHP
   * @exports   -
   * @author    -
   * @since     0.0.0
   * @version   -
   * ************************************************************************ */
  /* - */

  const SHT = {
    //
  };
  /* - */


  /* ***************************************************************************
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
   * @namespace    _
   * @dependencies none
   * @exports      -
   * @author       -
   * @since        0.0.0
   * @version      -
   * ************************************************************************ */
  /* eslint-disable one-var, semi-style, no-underscore-dangle */

  (function() {
    // IIFE

    // -- Module path


    // -- Local modules


    // -- Local constants


    // -- Local variables


    // -- Private Functions ----------------------------------------------------

    /**
     * Returns an UTF-8 string.
     *
     * @function (arg1, arg2, arg3)
     * @private
     * @param {Array}         the array buffer,
     * @param {Number}        the first included buffer item,
     * @param {Number}        the first excluded buffer item,
     * @throws {Error}        throws an error if it isn't an utf-8 data,
     * @returns {String}      returns the UTF-8 string,
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
            throw new Error('UTF-8 Decode failed. Two byte character was truncated.');
          }
          c1 = buf[start + i + 1];
          s += String.fromCharCode(((c & 0x1f) << 6) | (c1 & 0x3f));
          i += 2;
        } else {
          if (i + 2 >= len) {
            throw new Error('UTF-8 Decode failed. Two byte character was truncated.');
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

    _ = {

      /**
       * Returns an ASCII string.
       *
       * @method (arg1, arg2, arg3)
       * @public
       * @param {Array}       the array buffer,
       * @param {Number}      the first buffer item,
       * @param {Number}      the first excluded buffer item,
       * @returns {String}    returns an ascii string,
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
       * @param {Array}       the array buffer,
       * @param {Number}      the first buffer item,
       * @param {Number}      the first excluded buffer item,
       * @throws {Error}      throws an error if it isn't an utf-8 data,
       * @returns {String}    returns the UTF-8 string,
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
       * @param {Array}       the buffer array,
       * @param {Number}      the first item in the buffer array,
       * @returns {Number}    returns a number,
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
       * @param {Array}       the buffer array,
       * @param {Number}      the first item in the buffer array,
       * @returns {Number}    returns a number,
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
       * @param {Array}       the buffer array,
       * @param {Number}      the first item in the buffer array,
       * @returns {Number}    returns a number,
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
       * @param {Array}       the buffer array,
       * @param {Number}      the first item in the buffer array,
       * @returns {Number}    returns a number,
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
  }());
  /* eslint-enable one-var, semi-style, no-underscore-dangle */


  /* ***************************************************************************
   *
   * A set of primitives to download Natural Earth database files.
   *
   * load.js is just a literal object that contains a set of functions. It
   * can't be intantiated.
   *
   * Private Functions:
   *  . _XMLHttpRequest             loads the requested file,
   *  . _load                       loads the database,
   *
   *
   * Public Static Methods:
   *  . load                        loads the database,
   *
   *
   *
   * @namespace    SHT.Util
   * @dependencies none
   * @exports      -
   * @author       -
   * @since        0.0.0
   * @version      -
   * ************************************************************************ */
  /* eslint-disable one-var, semi-style, no-underscore-dangle */

  (function() {
    // IIFE

    // -- Module path


    // -- Local modules


    // -- Local constants


    // -- Local variables


    // -- Private Functions ----------------------------------------------------

    /**
     * Loads the requested file.
     *
     * @function (arg1, arg2, arg3)
     * @private
     * @param {String}        the file url,
     * @param {String}        the type of file (json or binary),
     * @param {Function}      the function to call at the completion,
     * @throws {Object}       throws an error if the type isn't supported,
     * @returns {String}      returns a string,
     * @since 0.0.0
    */
    const _XMLHttpRequest = function(url, type, callback) {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        let byteArray
          ;

        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 0) {
            switch (type) {
              case 'json':
                callback(false, xhr, xhr.responseText);
                break;
              case 'bin':
                byteArray = new Uint8Array(xhr.response);
                callback(false, xhr, byteArray);
                break;
              default:
                throw new Error(`load: the type "${type}" is unknown!`);
            }
          } else {
            callback(true, xhr);
          }
        }
      };

      switch (type) {
        case 'json':
          xhr.open('GET', url, true);
          xhr.send(null);
          break;
        case 'bin':
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.send(null);
          break;
        default:
          throw new Error(`_load: the type "${type}" is unknown!`);
      }
    };

    /**
     * Loads the database.
     *
     * @function (arg1, arg2)
     * @private
     * @param {String}        the database path,
     * @param {Function}      the function to call at the completion,
     * @returns {}            -,
     * @since 0.0.0
    */
    function _load(db, callback) {
      const name = db.split('/').pop();

      _XMLHttpRequest(`${db}/${name}.dbf`, 'bin', (err, xhr, dbf) => {
        _XMLHttpRequest(`${db}/${name}.shp`, 'bin', (err2, xhr2, shp) => {
          _XMLHttpRequest(`${db}/${name}.VERSION.txt`, 'json', (err3, xhr3, version) => {
            callback([dbf, shp, { db: name, version: version.replace(/[^\d.]/gi, '') }]);
          });
        });
      });
    }


    // -- Public Static Methods ------------------------------------------------

    SHT.Util = {

      /**
       * Loads the database.
       *
       * @method (arg1, arg2)
       * @public
       * @param {String}      the database path,
       * @param {Function}    the function to call at the completion,
       * @returns {}          -,
       * @since 0.0.0
       */
      load(db, callback) {
        _load(db, callback);
      },
    };
  }());
  /* eslint-enable one-var, semi-style, no-underscore-dangle */


  /* ***************************************************************************
   *
   * A set of primitives to process the DBF files.
   *
   * dbf.js is just a literal object that contains a set of functions. It
   * can't be intantiated.
   *
   * Private Functions:
   *  . _getHeader                  reads and returns the file header,
   *  . _retrieveFieldDescriptor    reads and returns the field descriptor,
   *  . _retrieveRecord             reads a record,
   *  . _getRecord                  returns a record,
   *
   *
   * Public Static Methods:
   *  . decode                      decodes the Dbf file,
   *  . getRecord                   returns the requested record or all,
   *
   *
   *
   * @namespace    SHT.DBF
   * @dependencies none
   * @exports      -
   * @author       -
   * @since        0.0.0
   * @version      -
   * ************************************************************************ */
  /* eslint-disable one-var, semi-style, no-underscore-dangle */

  (function() {
    // IIFE

    // -- Module path


    // -- Local modules


    // -- Local constants


    // -- Local variables


    // -- Private Functions ----------------------------------------------------

    /**
     * Reads and returns the file header.
     *
     * @function (arg1)
     * @private
     * @param {Object}        the Dbf object,
     * @returns {Object}      returns the dbf header,
     * @since 0.0.0
     */
    function _getHeader(dbf) {
      const header = {
        dbaseVersion: _.readUInt8(dbf.buf, 0),
        numberOfRecords: _.readUInt32LE(dbf.buf, 4),
        numberOfBytesInHeader: _.readUInt16LE(dbf.buf, 8),
        numberOfBytesInRecord: _.readUInt16LE(dbf.buf, 10),
        bytes12_14: 'Reserved bytes.',
        bytes15_27: 'Reserved for dBASE III PLUS on a LAN.',
        bytes28_31: 'Reserved bytes.',
        bytes32_n: 'Field Descriptor Array',
        terminator: '0x0D stored as the Field Descriptor terminator.',
        // Additional info
        numberOfFieldsArray: 0,
        startRecordSection: 0,
      };

      header.numberOfFieldsArray = ((header.numberOfBytesInHeader - 1) / 32) - 1;
      header.startRecordSection = header.numberOfBytesInHeader;
      return header;
    }

    /**
     * Reads and returns the field descriptor.
     *
     * @function (arg1, arg2)
     * @private
     * @param {Array}         the Dbf file buffer,
     * @param {Object}        the file header,
     * @throws {Object}       throws an error if the descriptor terminator is missing,
     * @returns {}            -,
     * @since 0.0.0
     */
    function _retrieveFieldDescriptor(buf, header) {
      const field  = [];
      let offset = 32;

      for (let i = 0; i < header.numberOfFieldsArray; i++) {
        field[i] = {};
        field[i].name = _.readString(buf, offset, offset + 11);
        field[i].type = String.fromCharCode(_.readUInt8(buf, offset + 11));
        field[i].dataAddress = _.readUInt32LE(buf, offset + 12);
        field[i].length = _.readUInt8(buf, offset + 16);
        field[i].count = _.readUInt8(buf, offset + 17);
        field[i].workArreaID = _.readUInt8(buf, offset + 20);
        field[i].flag = _.readUInt8(buf, offset + 23);
        offset += 32;
      }

      if (_.readUInt8(buf, offset) !== 0x0D) {
        throw new Error('Field Descriptor terminator 0x0D not found!');
      }
      return field;
    }

    /**
     * Reads a record.
     *
     * @function (arg1, arg2, arg2, arg4)
     * @private
     * @param {Array}         the Dbf file buffer,
     * @param {Object}        the file header,
     * @param {Object}        the field descriptor,
     * @param {Number}        the record to read,
     * @throws {Object}       throws an error if the record isn't valid,
     * @returns {Object}      returns the requested record,
     * @since 0.0.0
     */
    function _retrieveRecord(buf, header, fieldDescriptorArray, number) {
      const record = {};
      let s
        , offset = header.startRecordSection + (header.numberOfBytesInRecord * number)
        ;

      // Check that the first record byte is:
      //   0x20: if the record is not deleted,
      //   0x2A: if the record is deleted.
      if (_.readUInt8(buf, offset) !== 0x20 && _.readUInt8(buf, offset) !== 0x2A) {
        throw new Error(
          `The first byte of the record should be "0x20" or "0x2A" instead of: ${_.readUInt8(buf, offset).toString(16)}`,
        );
      }

      // Process the record:
      offset += 1;
      for (let i = 0; i < header.numberOfFieldsArray; i++) {
        s = _.readUTF8String(buf, offset, offset + fieldDescriptorArray[i].length);

        // Decode and process Data Type
        switch (fieldDescriptorArray[i].type) {
          // Type Character
          case 'C':
            // Remove leading and trailing spaces:
            record[fieldDescriptorArray[i].name] = s.replace(/^\s+|\s+$/g, '');
            break;

          // Type Date
          case 'D':
            throw new Error('Field Data Type "D" not processed yet!');

          // Type Binary coded decimal numeric
          case 'N':
            record[fieldDescriptorArray[i].name] = parseInt(s.replace(/^\s+|\s+$/g, ''), 10);
            break;

          // Type Floating point binary numeric
          case 'F':
            record[fieldDescriptorArray[i].name] = parseFloat(s);
            break;

          // Type Logical
          case 'L':
            throw new Error('Field Data Type "L" not processed yet!');

          // Type Memo
          case 'M':
            throw new Error('Field Data Type "M" not processed yet!');

          default:
            throw new Error(`Field Data Type ${fieldDescriptorArray[i].type} is not supported!`);
        }
        offset += fieldDescriptorArray[i].length;
      }
      return record;
    }

    /**
     * Returns a record.
     *
     * @function (arg1, arg2)
     * @private
     * @param {Object}        the Dbf object,
     * @param {Number}        the record to retrieve,
     * @returns {Array}       returns the requested record,
     * @since 0.0.0
     */
    /* eslint-disable max-len */
    function _getRecord(dbf, number) {
      const record = [];
      if (Object.prototype.toString.call(number) !== '[object Number]') {
        for (let i = 0; i < dbf.header.numberOfRecords; i++) {
          record[i] = _retrieveRecord(dbf.buf, dbf.header, dbf.fieldDescriptorArray, i);
        }
        return record;
      }

      // Check that this record number is an integer and in the range:
      if (number % 1 === 0 && number > 0 && number <= dbf.header.numberOfRecords) {
        // Return the requested record:
        const recordn = _retrieveRecord(dbf.buf, dbf.header, dbf.fieldDescriptorArray, number - 1);
        return recordn;
      }
      return null;
    }
    /* eslint-enable max-len */


    // -- Public Static Methods ------------------------------------------------

    SHT.DBF = {

      /**
       * Decodes the Dbf file.
       *
       * @method (arg1)
       * @public
       * @param {Object}      the Dbf object,
       * @returns {}          -,
       * @since 0.0.0
       */
      /* eslint-disable no-param-reassign */
      decode(dbf) {
        dbf.header = _getHeader(dbf);
        dbf.fieldDescriptorArray = _retrieveFieldDescriptor(dbf.buf, dbf.header);
      },
      /* eslint-enable no-param-reassign */

      /**
       * Returns the requested record or all.
       *
       * @method (arg1, arg2)
       * @public
       * @param {Object}      the Dbf object,
       * @param {Number}      the record to retrieve,
       * @returns {Array}     returns the requested record,
       * @since 0.0.0
       */
      getRecord(dbf, number) {
        return _getRecord(dbf, number);
      },
    };
  }());
  /* eslint-enable one-var, semi-style, no-underscore-dangle */


  /* ***************************************************************************
   *
   * A set of primitives to process the SHP files.
   *
   * shp.js is just a literal object that contains a set of functions. It
   * can't be intantiated.
   *
   *
   * Shapefile Format description:
   *  - http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf
   *
   * In brief:
   *
   *  -----------------------------
   * |  File Header (100 bytes)    |
   * |                             |
   *  -----------------------------
   * |  Record Header (8 bytes)    |
   *  -----------------------------
   * |  Record contents (variable) |
   *  -----------------------------
   * |                             |
   * |                             |
   *  -----------------------------
   * |  Record Header (8 bytes)    |
   *  -----------------------------
   * |  Record contents (variable) |
   *  -----------------------------
   *
   *
   * Private Functions:
   *  . _getHeader                  reads the header,
   *  . _retrievePoint              decodes and returns a Point geometry,
   *  . _retrievePolyLine           decodes an returns a Polyline/Polygon geometry,
   *  . _extractRecords             extracts the records,
   *  . _getRecord                  reads and returns a record or all,
   *
   *
   * Public Static Methods:
   *  . decode                      decodes the file header,
   *  . getRecord                   reads and returns a record,
   *
   *
   *
   * @namespace    SHT.SH
   * @dependencies none
   * @exports      -
   * @author       -
   * @since        0.0.0
   * @version      -
   * ************************************************************************ */
  /* eslint-disable one-var, semi-style, no-underscore-dangle */

  (function() {
    // IIFE

    // -- Module path


    // -- Local modules


    // -- Local constants
    const RECORD_START = 100
        , RECORD_HEAD  = 8
        ;


    // -- Local variables


    // -- Private Functions ----------------------------------------------------

    /**
     * Reads the header.
     *
     * @function (arg1)
     * @private
     * @param {Array}         the shp file buffer,
     * @throws {Object}       throws an error if the decoded header is invalid,
     * @returns {Object}      returns the decoded header,
     * @since 0.0.0
     */
    function _getHeader(buf) {
      const header = {
        code: _.readUInt32BE(buf, 0),
        byte4: 'Unused',
        byte8: 'Unused',
        byte12: 'Unused',
        byte16: 'Unused',
        byte20: 'Unused',
        fileLength: _.readUInt32BE(buf, 24) * 2,
        version: _.readUInt32LE(buf, 28),
        shape: _.readUInt32LE(buf, 32),
        Xmin: _.readDoubleLE(buf, 36),
        Ymin: _.readDoubleLE(buf, 44),
        Xmax: _.readDoubleLE(buf, 52),
        Ymax: _.readDoubleLE(buf, 60),
        Zmin: _.readDoubleLE(buf, 68),
        Zmax: _.readDoubleLE(buf, 76),
        Mmin: _.readDoubleLE(buf, 84),
        Mmax: _.readDoubleLE(buf, 92),
      };

      // Check if file starts with pattern '9994'.
      if (header.code !== 9994) {
        throw new Error(`This is not a SHP file! The first four bytes are: "${header.code}" instead of "9994"`);
      }

      // Check if 'Z' is equal to zero
      if (header.Zmin !== 0 || header.Zmax !== 0) {
        throw new Error('SHP files with Z type != zero are not supported!');
      }

      // Check if 'M' is equal to zero
      if (header.Mmin !== 0 || header.Mmax !== 0) {
        throw new Error('SHP files with points having M Measure are not supported!');
      }

      return header;
    }

    /**
     * Decodes and returns a Point geometry.
     *
     * @function (arg1, arg2)
     * @private
     * @param {Array}         the shp file buffer,
     * @param {Number}        the position of the first item in the buffer,
     * @returns {Array}       returns the Point geometry,
     * @since 0.0.0
     */
    function _retrievePoint(buf, offset) {
      // Order like this: [latitude, longitude].
      return [
        _.readDoubleLE(buf, offset + RECORD_HEAD + 12),
        _.readDoubleLE(buf, offset + RECORD_HEAD + 4),
      ];
    }

    /**
     * Decodes an returns a Polyline/Polygon geometry.
     *
     * @function (arg1, arg2)
     * @private
     * @param {Array}         the shp file buffer,
     * @param {Number}        the position of the first item in the buffer,
     * @returns {Array}       returns the Polyline/Polygon geometry,
     * @since 0.0.0
     */
    function _retrievePolyLine(buf, offset) {
      const record = []
            ;
      let first
        , last
        , coord
        ;

      // PolyLine and Polygon structure.
      const polyline = {
        // Bounding boxes.
        Xmin: _.readDoubleLE(buf, offset + RECORD_HEAD + 4),
        Ymin: _.readDoubleLE(buf, offset + RECORD_HEAD + 12),
        Xmax: _.readDoubleLE(buf, offset + RECORD_HEAD + 20),
        Ymax: _.readDoubleLE(buf, offset + RECORD_HEAD + 28),
        numParts: _.readUInt32LE(buf, offset + RECORD_HEAD + 36),
        numPoints: _.readUInt32LE(buf, offset + RECORD_HEAD + 40),
        parts: _.readUInt32LE(buf, offset + RECORD_HEAD + 44),
        // An array of length NumPoints. The points for each part in the
        // PolyLine are stored end to end.
        points: 0,
      };

      // Compute the position of the first point. It is:
      // offset + RECORD_HEAD + 44 bytes + 4 * numparts.
      const P0 = offset + RECORD_HEAD + 44 + (4 * polyline.numParts);

      // Process all the parts.
      for (let i = 0; i < polyline.numParts; i++) {
        // Compute the position of the first point in the given part.
        first = _.readUInt32LE(buf, offset + RECORD_HEAD + 44 + (i * 4));

        // Compute the position of the last point in the given part.
        if (i + 1 < polyline.numParts) {
          last = _.readUInt32LE(buf, offset + RECORD_HEAD + 44 + ((i + 1) * 4)) - 1;
        } else {
          last = polyline.numPoints - 1;
        }

        // Extract all coord. for one part or one ring.
        // Order like this: [latitude, longitude].
        coord = [];
        for (let j = first; j <= last; j++) {
          coord[j - first] = [
            _.readDoubleLE(buf, P0 + (16 * j) + 8),
            _.readDoubleLE(buf, P0 + (16 * j)),
          ];
        }
        record.push(coord);
      }

      // Return the set of coordinates that are stored in
      // array of arrays (one array per part or ring).
      return record;
    }

    /**
     * Extracts the records.
     *
     * @function (arg1, arg2)
     * @private
     * @param {Array}         the shp file buffer,
     * @param {Number}        the position of the first item in the buffer,
     * @throws {Object}       throws an error if the shape contains no processed types,
     * @returns {Array}       returns the extracted records,
     * @since 0.0.0
    */
    function _extractRecords(buf, header) {
      const record = [];
      let offset = RECORD_START;

      for (let i = 0; offset < header.fileLength; i++) {
        record[i] = {
          recordNumber: _.readUInt32BE(buf, offset),
          contentLength: _.readUInt32BE(buf, offset + 4),
          shape: _.readUInt32LE(buf, offset + RECORD_HEAD),
          type: '',
          coordinates: [],
        };

        // Process shape
        switch (record[i].shape) {
          // Type Null Shape
          case 0:
            throw new Error('The Shape Type "Null Shape" is not supported yet!');

          // Type Point
          case 1:
            record[i].type = 'Point';
            record[i].coordinates = _retrievePoint(buf, offset);
            break;

          // Type PolyLine
          case 3:
            record[i].type = 'PolyLine';
            record[i].coordinates = _retrievePolyLine(buf, offset);
            break;

          // Type Polygon
          case 5:
            record[i].type = 'Polygon';
            record[i].coordinates = _retrievePolyLine(buf, offset);
            break;

          // Type MultiPoint
          case 8:
            throw new Error('The Shape Type "MultiPoint" is not supported yet!');

          // Type PointZ
          case 11:
            throw new Error('The Shape Type "PointZ" is not supported yet!');

          // Type PolyLineZ
          case 13:
            throw new Error('The Shape Type "PolyLineZ" is not supported yet!');

          // Type PolygonZ
          case 15:
            throw new Error('The Shape Type "PolygonZ" is not supported yet!');

          // Type MultiPointZ
          case 18:
            throw new Error('The Shape Type "MultiPointZ" is not supported yet!');

          // Type PointM
          case 21:
            throw new Error('The Shape Type "PointM" is not supported yet!');

          // Type PolyLineM
          case 23:
            throw new Error('The Shape Type "PolyLineM" is not supported yet!');

          // Type PolygonM
          case 25:
            throw new Error('The Shape Type "PolygonM" is not supported yet!');

          // Type MultiPointM
          case 28:
            throw new Error('The Shape Type "MultiPointM" is not supported yet!');

          // Type MultiPatch
          case 31:
            throw new Error('The Shape Type "MultiPatch" is not supported yet!');

          // Unknown type
          default:
            throw new Error(`The Shape Type "${record[i].shape}" is unknown!`);
        }
        offset += (record[i].contentLength * 2) + RECORD_HEAD;
      }
      return record;
    }

    /**
     * Reads and returns a record or all.
     *
     * @function (arg1, arg2)
     * @private
     * @param {Object}      the shp object,
     * @param {Number}      the record to read,
     * @throws {Object}     throws an error if the requested record is invalid,
     * @returns {Array}     returns the requested record or all,
     * @since 0.0.0
    */
    function _getRecord(shp, n) {
      // Extract all the records.
      const records = _extractRecords(shp.buf, shp.header);

      // If the record number is undefined, return all the records.
      if (!n) {
        return records;
      }

      // Check that this record number isn't fantaisist!
      if (n % 1 !== 0 || n < 1) {
        throw new Error(`This record number "${n}" does not match!`);
      }

      // Return the requested record or null if it is out of range.
      if (records[n - 1]) {
        return records[n - 1];
      }
      return null;
    }


    // -- Public Static Methods ------------------------------------------------

    SHT.SH = {

      /**
       * Decodes the file header.
       *
       * @method (arg1)
       * @public
       * @param {Object}      the shp object,
       * @returns {Object}    returns the decoded header,
       * @since 0.0.0
       */
      /* eslint-disable no-param-reassign */
      decode(shp) {
        shp.header = _getHeader(shp.buf);
      },
      /* eslint-disable no-param-reassign */

      /**
       * Reads and returns a record.
       *
       * @method (arg1, arg2)
       * @public
       * @param {Object}      the shp object,
       * @param {Number}      the record to read,
       * @returns {Array}     returns the requested record or all,
       * @since 0.0.0
       */
      getRecord(shp, n) {
        return _getRecord(shp, n);
      },
    };
  }());
  /* eslint-enable one-var, semi-style, no-underscore-dangle */


  /* ***************************************************************************
   *
   * Defines the SHP object.
   *
   * shp.js is built upon the Prototypal Instantiation pattern. It
   * returns an object by calling its constructor. It doesn't use the new
   * keyword.
   *
   * Private Functions:
   *  . none,
   *
   *
   * Constructor:
   *  . SHP                         creates and returns the SHP object,
   *
   *
   * Public Static Methods:
   *  . noConflict                  returns a reference to this SHP object,
   *
   *
   * Private Methods:
   *  . _getDbfRecord               returns a Dbf record,
   *  . _getDbfHeader               returns the header of the Dbf file,
   *  . _getDbfFieldDescriptor      returns the field descriptor of the Dbf file,
   *  . _getShpRecord               returns a Shp record
   *  . _getShpHeader               returns the header of the shp file,
   *

   * Public Methods:
   *  . load                        loads the Natural Earth database,
   *  . getCollection               returns a GeoJSON collection,
   *  . getFeature                  returns the requested GeoJSON feature,
   *  . getSource                   returns the name and the version of the db,
   *
   *
   *
   * @namespace    SHP
   * @dependencies none
   * @exports      -
   * @author       -
   * @since        0.0.0
   * @version      -
   * ************************************************************************ */
  /* eslint-disable one-var, semi-style, no-underscore-dangle */

  (function() {
    // IIFE

    // -- Module path


    // -- Local modules
    const { Util } = SHT
        , { DBF }  = SHT
        , { SH }   = SHT
        ;


    // -- Local constants
    // Saves the previous value of the library variable, so that it can be
    // restored later on, if noConflict is used.
    const previousSHP = root.SHP
        ;


    // -- Local variables
    let methods
      ;


    // -- Public ---------------------------------------------------------------

    /**
     * Returns the SHP object.
     * (Prototypal Instantiation Pattern)
     *
     * @constructor (arg1)
     * @public
     * @param {String}        the argument to be saved as an object variable,
     * @returns {Object}      returns the SHP object,
     * @since 0.0.0
     */
    SHP = function() {
      const obj = Object.create(methods);
      obj._dbf = {
        buf: null,
        header: null,
        fieldDescriptorArray: null,
      };
      obj._shp = {
        buf: null,
        header: null,
      };
      return obj;
    };

    // Attaches a constant to SHP that provides the version of the lib.
    SHP.VERSION = '0.0.1';


    // -- Public Static Methods ------------------------------------------------

    /**
     * Returns a reference to this SHP object.
     *
     * Nota:
     * Running SHP in noConflic mode, returns the SHP variable to its
     * previous owner.
     *
     * @method ()
     * @public
     * @param {}              -,
     * @returns {String}      returns the SHP object,
     * @since 0.0.0
     */
    /* istanbul ignore next */
    SHP.noConflict = function() {
      /* eslint-disable-next-line no-param-reassign */
      root.SHP = previousSHP;
      return this;
    };


    methods = {

      // -- Private Methods ----------------------------------------------------

      /**
       * Returns a Dbf record.
       *
       * @method (arg1)
       * @private
       * @param {Number}       the record number,
       * @returns {Object}     returns the requested Dbf record,
       * @since 0.0.0
       */
      _getDbfRecord(n) {
        return DBF.getRecord(this._dbf, n);
      },

      /**
       * Returns the header of the Dbf file.
       *
       * @method ()
       * @private
       * @param {}            -,
       * @returns {Object}    return the header,
       * @since 0.0.0
       */
      _getDbfHeader() {
        return this._dbf.header;
      },

      /**
       * Returns the field Descriptor of the Dbf file.
       *
       * @method ()
       * @private
       * @param {}            -,
       * @returns {Object}    returns the field Descriptor,
       * @since 0.0.0
       */
      _getDbfFieldDescriptor() {
        return this._dbf.fieldDescriptorArray;
      },

      /**
       * Returns a Shp record.
       *
       * @method (arg1)
       * @private
       * @param {Number}      the requested record,
       * @returns {Object}    returns the requested record,
       * @since 0.0.0
       */
      _getShpRecord(n) {
        return SH.getRecord(this._shp, n);
      },

      /**
       * Returns the header of the shp file.
       *
       * @method ()
       * @private
       * @param {}            -,
       * @returns {Object}    returns the header,
       * @since 0.0.0
       */
      _getShpHeader() {
        return this._shp.header;
      },


      // -- Public Methods -----------------------------------------------------

      /**
       * Loads the Natural Earth database.
       *
       * @method (arg1, arg2)
       * @public
       * @param {String}      the database path,
       * @param {Function}    the function to call at the completion,
       * @returns {Object}    returns a promise,
       * @since 0.0.0
       */

      load(db, callback) {
        return new Promise((resolve) => {
          Util.load(db, (data) => {
            [this._dbf.buf] = data;
            [, this._shp.buf] = data;
            [,, this._source] = data;
            DBF.decode(this._dbf);
            SH.decode(this._shp);
            resolve();
            if (callback) callback();
          });
        });
      },

      /**
       * Returns a GeoJSON collection.
       *
       * @method ()
       * @public
       * @param {}            -,
       * @returns {Object}    returns a collection,
       * @since 0.0.0
       */
      getCollection() {
        const { header } = this._shp
            , dbfrecord  = this._getDbfRecord()
            , shprecord  = this._getShpRecord()
            ;

        const collection = {
          bbox: [header.Xmin, header.Ymin, header.Xmax, header.Ymax],
          type: 'FeatureCollection',
          features: [],
        };

        for (let i = 0; i < this._dbf.header.numberOfRecords; i++) {
          collection.features[i] = {
            type: 'Feature',
            properties: dbfrecord[i],
            geometry: {
              type: shprecord[i].type,
              coordinates: shprecord[i].coordinates,
            },
          };
        }
        return collection;
      },

      /**
       * Returns the requested GeoJSON feature.
       *
       * @method (arg1)
       * @public
       * @param {Number}      the requested feature,
       * @returns {Object}    returns a GeoJON feature,
       * @since 0.0.0
       */
      getFeature(n) {
        // Is this record available?
        if (typeof n !== 'number'
            || n % 1 !== 0
            || n <= 0
            || n > this._dbf.header.numberOfRecords) {
          throw new Error(`The record Number "${n}" does not match!`);
        }

        const record = SH.getRecord(this._shp, n);
        return {
          type: 'Feature',
          properties: DBF.getRecord(this._dbf, n),
          geometry: {
            type: record.type,
            coordinates: record.coordinates,
          },
        };
      },

      /**
       * Returns the name and the version of the Natural Earth database.
       *
       * @method ()
       * @public
       * @param {}            -,
       * @returns {Object}    returns the data source,
       * @since 0.0.0
       */
      getSource() {
        return {
          name: this._source.db,
          version: this._source.version,
        };
      },
    };
  }());
  /* eslint-enable one-var, semi-style, no-underscore-dangle */


  // Returns the library name:
  return SHP;
}));
