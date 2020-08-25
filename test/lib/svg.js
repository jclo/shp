/* eslint-disable one-var, semi-style, no-underscore-dangle, prefer-destructuring */

const SVG = (function() {
  //
  // -- Private Functions ------------------------------------------------------

  /**
   * Applies a mirror projection.
   */
  function _mirror(coord, mirror) {
    let c = [];

    switch (mirror) {
      case 'x':
        c[0] = coord[0];
        c[1] = -coord[1];
        break;

      case 'y':
        c[0] = -coord[0];
        c[1] = coord[1];
        break;

      case 'xy':
        c[0] = -coord[0];
        c[1] = -coord[1];
        break;

      default:
        c = [...coord];
    }

    return c;
  }

  /**
   * Applies a mercator projection.
   */
  function _mercator(φdegree, λdegree, zoom, λodegree) {
    const z  = zoom || 1
        , r  = Math.PI / 180
        , φ  = φdegree * r
        // , λ  = λdegree * r
        , λo = λodegree || 0
        ;

    // let x = λ - λo;
    // x /= r;
    const x = λdegree - λo;
    // A mercator projection for a latitude greater than 85.05° or lower
    // than -85.05° tends to infinity. Thus, we limit the latitude
    // to |85.05°| i.e., a projection to |180|.
    let y;
    if (φdegree > 85.05) {
      y = 180;
    } else if (φdegree < -85.05) {
      y = -180;
    } else {
      y = Math.log(Math.tan((1 / 4) * Math.PI + (1 / 2) * φ)) / r;
    }
    return [x * z, y * z];
  }

  /**
   * Applies a linear projection.
   */
  function _linear(φ, λ) {
    return [λ, φ];
  }

  /**
   * Applies the requested transformations.
   */
  function _transform(coord, option) {
    let c;

    // Projection
    if (option && option.projection && option.projection === 'mercator') {
      c = _mercator(coord[0], coord[1], 1, 0);
    } else {
      c = _linear(coord[0], coord[1]);
    }

    // Mirroring
    if (option && option.mirror) {
      c = _mirror(c, option.mirror);
    }

    // Scaling
    if (option && option.scale && typeof option.scale === 'number' && option.scale > 1) {
      c = [c[0] * option.scale, c[1] * option.scale];
    }
    return c;
  }

  /**
   * Converts the coordinates to an SVG path.
   */
  function _getSVGPath(coord, options) {
    let path
      , subpath
      , x
      , y
      , i
      , j
      ;

    path = '';
    for (i = 0; i < coord.length; i++) {
      subpath = '';
      for (j = 0; j < coord[i].length; j++) {
        [x, y] = _transform(coord[i][j], options);
        if (subpath === '') {
          subpath = `M${x},${y}`;
        } else {
          subpath += `L${x},${y}`;
        }
      }
      subpath += 'z';
      path += subpath;
    }
    return path;
  }

  /**
   * Converts a GEOJSON to an XML SVG string.
   */
  function _process(json, options) {
    // Add the header:
    let s = [
      '<!-- Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. -->\n',
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n',
      '  <g transform="translate(0, 0) scale(1, 1)">\n',
    ].join('');

    // Add the SVG elements:
    let d;
    if (json.type === 'FeatureCollection') {
      for (let i = 0; i < json.features.length; i++) {
        d = _getSVGPath(json.features[i].geometry.coordinates, options);
        s += `    <path id="" class="land" d="${d}"></path>\n`;
      }
    } else {
      d = _getSVGPath(json.geometry.coordinates, options);
      s += `    <path id="" class="land" d="${d}"></path>\n`;
    }

    // Append the XML Footer:
    s += '  </g>\n';
    s += '</svg>\n';

    return s;
  }


  // -- Public -----------------------------------------------------------------

  return {
    /**
     * Converts a GeoJSON to an XML SVG string.
     */
    to(json, options) {
      return _process(json, options);
    },
  };
}());
