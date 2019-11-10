# SHP

[![NPM version][npm-image]][npm-url]
[![Travis CI][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies status][dependencies-image]][dependencies-url]
[![Dev Dependencies status][devdependencies-image]][devdependencies-url]
[![License][license-image]](LICENSE.md)
<!--- [![node version][node-image]][node-url] -->

[![NPM install][npm-install-image]][npm-install-url]

SHP is a light Javascript API for reading Natural Earth's DB files. SHP provides methods to extract data from the database and creates GeoJSON outputs.

SHP runs on both Node.js and broswsers that are ECMAScript 2015 (ES6) compliant.


## Usage

Usage

Extract data and create a GeoJSON object:

```javascript
const SHP = require('@mobilabs/shp');

// Create an object:
const shp = SHP();

// Load the Natural Earth database:
await shp.load('<path>/ne_110m_admin_0_countries')

// Get a GeoJSON collection:
const collection = shp.getCollection();

// Get a GeoJSON feature:
const feature = shp.getFeature('feature number');
```

The GeoJSON object looks like:

```javascript
{
  bbox: [ ... ],
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: [Object], geometry: [Object] },
    ...
    { type: 'Feature', properties: [Object], geometry: [Object] }
  ]
}
```

A Feature looks like:

```javascript
{
  type: 'Feature',
  properties: { ... },
  geometry : {
    type: 'Polygon'
    coordinates: [ ... ]
  }
}
```

***Nota***:

A `Natural Earth`'s database is a folder that contains, at least, three files having the same name as the folder and with the suffix `.dbf`, `.shp` and `.VERSION.txt`. For instance, Natural Earth's database `ne_50m_admin_0_countries` must contains the files: `ne_50m_admin_0_countries.dbf`, `ne_50m_admin_0_countries.shp` and `ne_50m_admin_0_countries.VERSION.txt`.


## API

This module implements three methods:

  * getFeature(feature number),
  * getCollection(),
  * getSource(),


### getFeature(n)

This method extracts one Feature from Natural Earth's database and returns a Javascript GeoJSON object.

This method requires one argument. Its is a number - the Feature number. It starts from 1.


### getCollection()

This method extracts a FeatureCollection from Natural Earth's database and returns a Javascript GeoJSON object. A FeatureCollection is a set of Feature.


### getSource()

This method returns an object that contains the name and the version of the Natural Earth's database.


## License

MIT.

<!--- URls -->

[npm-image]: https://img.shields.io/npm/v/@mobilabs/shp.svg?style=flat-square
[npm-install-image]: https://nodei.co/npm/@mobilabs/shp.png?compact=true
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[download-image]: https://img.shields.io/npm/dm/@mobilabs/shp.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/jclo/shp.svg?style=flat-square
[coveralls-image]: https://img.shields.io/coveralls/jclo/shp/master.svg?style=flat-square
[dependencies-image]: https://david-dm.org/jclo/shp/status.svg?theme=shields.io
[devdependencies-image]: https://david-dm.org/jclo/shp/dev-status.svg?theme=shields.io
[license-image]: https://img.shields.io/npm/l/@mobilabs/shp.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/@mobilabs/shp
[npm-install-url]: https://nodei.co/npm/@mobilabs/shp
[node-url]: http://nodejs.org/download
[download-url]: https://www.npmjs.com/package/@mobilabs/shp
[travis-url]: https://travis-ci.org/jclo/shp
[coveralls-url]: https://coveralls.io/github/jclo/shp?branch=master
[dependencies-url]: https://david-dm.org/jclo/shp
[devdependencies-url]: https://david-dm.org/jclo/shp?type=dev
[license-url]: http://opensource.org/licenses/MIT
