/** ************************************************************************
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
 * @namespace    -
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
 * Loads the requested file.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the file url,
 * @param {String}          the type of file (json or binary),
 * @param {Function}        the function to call at the completion,
 * @throws {Object}         throws an error if the type isn't supported,
 * @returns {String}        returns a string,
 * @since 0.0.0
*/
const _XMLHttpRequest = function(url, type, callback) {
  const xhr = new window.XMLHttpRequest();

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
 * @param {String}          the database path,
 * @param {Function}        the function to call at the completion,
 * @returns {}              -,
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

const Util = {

  /**
   * Loads the database.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the database path,
   * @param {Function}      the function to call at the completion,
   * @returns {}            -,
   * @since 0.0.0
   */
  load(db, callback) {
    _load(db, callback);
  },
};


// -- Export
export default Util;

/* eslint-enable one-var, semi-style, no-underscore-dangle */
