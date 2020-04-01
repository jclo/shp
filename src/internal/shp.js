/** ************************************************************************
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
 * @namespace    SHP.src.internal.shp
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
import _ from '../lib/_';


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
 * @param {Array}           the shp file buffer,
 * @throws {Object}         throws an error if the decoded header is invalid,
 * @returns {Object}        returns the decoded header,
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
    throw new Error(
      `This is not a SHP file! The first four bytes are: "${header.code}" instead of "9994"`,
    );
  }

  // Check if 'Z' is equal to zero
  if (header.Zmin !== 0 || header.Zmax !== 0) {
    throw new Error(
      'SHP files with Z type != zero are not supported!',
    );
  }

  // Check if 'M' is equal to zero
  if (header.Mmin !== 0 || header.Mmax !== 0) {
    throw new Error(
      'SHP files with points having M Measure are not supported!',
    );
  }

  return header;
}

/**
 * Decodes and returns a Point geometry.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Array}           the shp file buffer,
 * @param {Number}          the position of the first item in the buffer,
 * @returns {Array}         returns the Point geometry,
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
 * @param {Array}           the shp file buffer,
 * @param {Number}          the position of the first item in the buffer,
 * @returns {Array}         returns the Polyline/Polygon geometry,
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
 * @param {Array}           the shp file buffer,
 * @param {Number}          the position of the first item in the buffer,
 * @throws {Object}         throws an error if the shape contains no processed types,
 * @returns {Array}         returns the extracted records,
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
 * @param {Object}          the shp object,
 * @param {Number}          the record to read,
 * @throws {Object}         throws an error if the requested record is invalid,
 * @returns {Array}         returns the requested record or all,
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

const SH = {

  /**
   * Decodes the file header.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the shp object,
   * @returns {Object}      returns the decoded header,
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
   * @param {Object}        the shp object,
   * @param {Number}        the record to read,
   * @returns {Array}       returns the requested record or all,
   * @since 0.0.0
   */
  getRecord(shp, n) {
    return _getRecord(shp, n);
  },
};


// -- Export
export default SH;

/* eslint-enable one-var, semi-style, no-underscore-dangle */
