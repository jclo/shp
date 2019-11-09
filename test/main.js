// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, no-unused-vars: 0, semi-style: 0 */

'use strict';

// -- Node modules
const should     = require('chai').should()
    , { expect } = require('chai')
    ;

// -- Local modules
const SHP = require('../index.js')
    ;


// -- Local constants


// -- Local variables


// -- Main
describe('Test SHP:', () => {
  // Test the lib:
  describe('Test SHP.VERSION and SHP.noConflict:', () => {
    it('Expects SHP.VERSION to return a string.', () => {
      expect(SHP.VERSION).to.be.a('string');
    });
    it('Expects SHP.noConflict to return a function.', () => {
      expect(SHP.noConflict).to.be.a('function');
    });
  });

  describe('Test SHP constructor and methods:', () => {
    const o = SHP();

    it('Expects SHP() to return an object.', () => {
      expect(o).to.be.an('object');
    });

    it('Expects this object to own the property "load" that is a function.', () => {
      expect(o).to.have.property('load').that.is.a('function');
    });
  });
});
