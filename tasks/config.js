/* eslint */

'use strict';

module.exports = {
  dist: './_dist',
  libdir: './lib',
  libname: 'SHP',
  parent: 'this',
  noparent: '-noparent',
  index: './index.js',
  // These are the Javascript files required to build the library.
  /* eslint-disable no-multi-spaces */
  src: [
    // These three files (_header, tree.js) must be declared in this order
    // as they create the umd module and define the object tree and
    // the function to fill the tree!
    './src/_header',
    './src/tree.js',
    './src/lib/_.js',

    './src/internal/load.js',
    './src/internal/dbf.js',
    './src/internal/shp.js',

    './src/shp.js',

    // This file must always be the last one as it closes the umd module.
    './src/_footer',
  ],
  /* eslint-enable no-multi-spaces */
  license: ['/*! ****************************************************************************',
    ' * {{lib:name}} v{{lib:version}}',
    ' *',
    ' * {{lib:description}}.',
    ' * (you can download it from npm or github repositories)',
    ' * Copyright (c) 2019 {{lib:author}} <{{lib:email}}> ({{lib:url}}).',
    ' * Released under the MIT license. You may obtain a copy of the License',
    ' * at: http://www.opensource.org/licenses/mit-license.php).',
    ' * ************************************************************************** */',
    ''].join('\n'),
};
