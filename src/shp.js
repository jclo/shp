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

'use strict';

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
  SHP.VERSION = '{{lib:version}}';


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
