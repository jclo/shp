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

'use strict';

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
