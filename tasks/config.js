/* eslint one-var: 0, semi-style: 0 */


// -- Vendor modules


// -- Local modules
const pack = require('../package.json');


// -- Local constants
const libname = 'SHP'
    , name    = libname.replace(/\s+/g, '').toLowerCase()
    ;


// -- Local variables


// -- Main

module.exports = {
  dist: './_dist',
  libdir: './lib',
  libname,
  parent: 'this',
  noparent: '-noparent',
  index: './index.js',
  distlink: `./_dist/lib/${name}.js`,

  // These are the Javascript files required to build the library.
  /* eslint-disable no-multi-spaces */
  src: {
    // This is the header section of the UMD module:
    header: './src/_header',

    // This is the code of the library that is surrounded by the UMD module
    // header and footer.
    core: [
      './src/shp.js',
      './src/lib/_.js',
      './src/internal/load.js',
      './src/internal/dbf.js',
      './src/internal/shp.js',
    ],

    // This is the footer section of the UMD module:
    footer: './src/_footer',
  },
  /* eslint-enable no-multi-spaces */

  get license() {
    return ['/*! ****************************************************************************',
      ` * ${libname} v${pack.version}`,
      ' *',
      ` * ${pack.description}.`,
      ' * (you can download it from npm or github repositories)',
      ` * Copyright (c) ${(new Date()).getFullYear()} ${pack.author.name} <${pack.author.email}> (${pack.author.url}).`,
      ' * Released under the MIT license. You may obtain a copy of the License',
      ' * at: http://www.opensource.org/licenses/mit-license.php).',
      ' * Built from ES6libplus v0.0.6.',
      ' * ************************************************************************** */',
      ''].join('\n');
  },
};
