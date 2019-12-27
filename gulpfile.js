/* eslint one-var: 0, semi-style: 0 */

// -- Node modules
const { watch, series } = require('gulp')
    , connect = require('gulp-connect')
    , open    = require('open')
    ;


// -- Local constants
const filesToWatch = ['src/**/*.js', 'src/_header', 'src/_footer']
    ;


// -- Local variables


// -- Gulp Private Tasks
const build       = require('./tasks/makejs')
    , makedist    = require('./tasks/makedist')
    ;


// -- Gulp watch
function fwatch() {
  watch(filesToWatch, series(build));
}

// -- Gulp connect:
function server(cb) {
  connect.server({
    root: './',
    port: 8088,
    livereload: true,
  });
  open('http://localhost:8088/');
  cb();
}


// Gulp Public Tasks:
exports.watch = fwatch;
exports.build = build;
exports.connect = server;
exports.makedist = makedist;
exports.default = series(build, makedist);
