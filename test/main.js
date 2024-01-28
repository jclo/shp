// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules


// -- Local Modules
const testlib = require('./int/lib')
    , pack    = require('../package.json')
    ;


// -- Local Constants
const libname = 'SHP';


// -- Local Variables


// -- Main

// This define root for Node.js:
global.root = {};

// Nota:
// If you want that 'display-coverage' shows the coverage files by files,
// you should set 'SHP' and 'testlib' like this:
//  . const SHP = require('../src/<file>').default;
//  . testlib(SHP, '{{lib:name}}', '{{lib:version}}', 'without new');
//
// But, if you want that 'display-coverage' shows the coverage in one file,
// you should set 'SHP' and 'testlib' like this:
//  . const SHP = require('../index');
//  . testlib(SHP, libname, pack.version, 'without new');

const SHP = require('../src/shp').default;
// const SHP = require('../index');

describe('Test SHP:', () => {
  testlib(SHP, '{{lib:name}}', '{{lib:version}}', 'without new');
  // testlib(SHP, libname, pack.version, 'without new');
});

// - oOo --
