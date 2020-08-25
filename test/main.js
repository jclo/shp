// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules


// -- Local Modules
const // SHP = require('../index')
    SHP = require('../src/shp').default
    , pack     = require('../package.json')
    , testlib  = require('./int/lib')
    ;


// -- Local Constants
const libname = 'SHP';


// -- Local Variables


// -- Main

// Nota:
// If you choose 'SHP = require('../index')', 'display-coverage' will
// show the coverage of all the library in one file.
//
// If you want to display the coverage file by file, you must choose
// 'SHP = require('../src/prototypal').default'. But, in this case,
// the build isn't done, so you should pass '{{lib:name}}' as libname and
// '{{lib:version}}' as the library version.

describe('Test SHP:', () => {
  testlib(SHP, '{{lib:name}}', '{{lib:version}}');
  // testlib(SHP, libname, pack.version);
});
