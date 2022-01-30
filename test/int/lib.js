// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;


// -- Local Modules


// -- Local Constants
// Number of owned custom properties added by your library,
// number of owned and inherited properties added by your library (instance),
// number of items returned by '_setTestMode'.
const LIBPROPS = 0
    , OWNPROPS = 3
    , INHPROPS = 10
    , TESTMODE = 0
    ;


// -- Local Variables


// -- Main
module.exports = function(SHP, libname, version, type) {
  describe('SHP introspection:', () => {
    describe('Test the nature of SHP:', () => {
      it('Expects SHP to be a function.', () => {
        expect(SHP).to.be.a('function');
      });

      it(`Expects SHP to own ${4 + LIBPROPS} custom properties.`, () => {
        expect(Object.keys(SHP)).to.be.an('array').that.has.lengthOf(4 + LIBPROPS);
      });


      // -- This section must not be modified --
      // NAME, VERSION, _library, _setTestMode, noConflict
      describe('Check the owned generic custom properties:', () => {
        it(`Expects SHP to own the property "NAME" whose value is "${libname}".`, () => {
          expect(SHP).to.own.property('NAME').that.is.equal(libname);
        });

        it(`Expects SHP to own the property "VERSION" whose value is "${version}".`, () => {
          expect(SHP).to.own.property('VERSION');
        });

        it('Expects SHP to own the property "_setTestMode" that is a function.', () => {
          expect(SHP).to.own.property('_setTestMode').that.is.a('function');
        });

        it('Expects SHP to own the property "noConflict" that is a function.', () => {
          expect(SHP).to.own.property('noConflict').that.is.a('function');
        });

        describe('Test the owned generic custom properties:', () => {
          it(`Expects the property "_setTestMode" to return an array with ${TESTMODE} item(s).`, () => {
            expect(SHP._setTestMode()).to.be.an('array').that.has.lengthOf(TESTMODE);
          });

          it('Expects the property "noConflict" to return a function.', () => {
            expect(SHP.noConflict()).to.be.a('function');
          });
        });


        // -- This section must  be adapted --
        // Add here the owned properties added by your library.
        describe('Check the owned specific custom properties:', () => {
          it('Expects SHP to own the property ... to be completed or ... removed!', () => {
            expect(true).to.be.equal(true);
          });

          describe('Test the owned specific custom properties:', () => {
            it('Expects SHP the property ... to be completed or ... removed!', () => {
              expect(true).to.be.equal(true);
            });
          });
        });
      });
    });


    describe('Test SHP constructor:', () => {
      if (type === 'with new') {
        it('Expects SHP() without the operator "new" to throw an error.', () => {
          try {
            SHP();
          } catch (e) {
            expect(e.message).to.be.a('string').that.is.equal('SHP needs to be called with the new keyword!');
          }
        });
      }

      const o = type === 'with new' ? new SHP() : SHP();
      const op = Object.getOwnPropertyNames(o);
      const io = Object.keys(Object.getPrototypeOf(o));

      it('Expects the function SHP to return an object.', () => {
        expect(o).to.be.an('object');
      });

      it(`Expects SHP object to own ${1 + OWNPROPS} property(ies).`, () => {
        expect(op).to.be.an('array').that.has.lengthOf(1 + OWNPROPS);
      });


      // -- This section must not be modified --
      // _library
      describe('Check the owned generic properties:', () => {
        it('Expects SHP object to own the property "_library" that is an object.', () => {
          expect(o).to.own.property('_library').that.is.an('object');
        });

        describe('Test the owned generic properties:', () => {
          it('Expects the property "_library" to own two properties.', () => {
            expect(Object.keys(o._library)).to.be.an('array').that.has.lengthOf(2);
          });
          it(`Expects the property "_library" to own the property "name" whose value is "${libname}".`, () => {
            expect(o._library).to.own.property('name').that.is.equal(libname);
          });
          it(`Expects the property "_library" to own the property "version" whose value is "${version}".`, () => {
            expect(o._library).to.own.property('version').that.is.equal(version);
          });
        });


        // -- This section must be adapted --
        // Add here the owned properties added by your library.
        describe('Check the owned specific custom properties:', () => {
          it('Expects SHP object to own the property "_dbf" that is an object.', () => {
            expect(o).to.own.property('_dbf').that.is.an('object');
          });

          it('Expects SHP object to own the property "_shp" that is an object.', () => {
            expect(o).to.own.property('_shp').that.is.an('object');
          });

          it('Expects SHP object to own the property "_source" that is null.', () => {
            expect(o).to.own.property('_source').that.is.equal(null);
          });

          describe('Test the owned specific custom properties:', () => {
            it('Expects SHP the property ... to be completed or ... removed!', () => {
              expect(true).to.be.equal(true);
            });
          });
        });
      });


      // -- This section must not be modified --
      // whoami
      describe('Check the inherited generic properties:', () => {
        it(`Expects SHP object to inherit ${1 + INHPROPS} property(ies).`, () => {
          expect(io).to.be.an('array').that.has.lengthOf(1 + INHPROPS);
        });

        it('Expects SHP object to inherit the property "whoami" that is a function.', () => {
          expect(o).to.have.property('whoami').that.is.a('function');
        });

        describe('Test the inherited generic properties:', () => {
          it('Expects the property "whoami" to return an object.', () => {
            expect(o.whoami()).to.be.an('object');
          });
          it('Expects this object to own two properties.', () => {
            expect(Object.keys(o.whoami())).to.be.an('array').that.has.lengthOf(2);
          });
          it(`Expects this object to own the property "name" whose value is "${libname}".`, () => {
            expect(o.whoami()).to.own.property('name').that.is.equal(libname);
          });
          it(`Expects this object to own the property "version" whose value is "${version}".`, () => {
            expect(o.whoami()).to.own.property('version').that.is.equal(version);
          });
        });
      });


      // -- This section must be adapted --
      // Replace here 'getString' and 'getArray' by the inherited properties
      // added by your library.
      describe('Check the inherited specific properties:', () => {
        it('Expects SHP object to inherit the property "_getDbfRecord" that is a function.', () => {
          expect(o).to.have.property('_getDbfRecord').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "_getDbfHeader" that is a function.', () => {
          expect(o).to.have.property('_getDbfHeader').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "_getDbfFieldDescriptor" that is a function.', () => {
          expect(o).to.have.property('_getDbfFieldDescriptor').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "_getShpRecord" that is a function.', () => {
          expect(o).to.have.property('_getShpRecord').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "_getShpHeader" that is a function.', () => {
          expect(o).to.have.property('_getShpHeader').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "_load" that is a function.', () => {
          expect(o).to.have.property('_load').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "load" that is a function.', () => {
          expect(o).to.have.property('load').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "getCollection" that is a function.', () => {
          expect(o).to.have.property('getCollection').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "getFeature" that is a function.', () => {
          expect(o).to.have.property('getFeature').that.is.a('function');
        });

        it('Expects SHP object to inherit the property "getSource" that is a function.', () => {
          expect(o).to.have.property('getSource').that.is.a('function');
        });

        describe('Test the inherited specific properties:', () => {
          it('Expects ... to be done!', () => {
            expect(true).to.be.equal(true);
          });
          // it('Expects the property "getString" to return the string "I am a string!".', () => {
          //   expect(o.getString()).to.be.a('string').that.is.equal('I am a string!');
          // });
          //
          // it('Expects the property "getArray" to return an array with 3 elements.', () => {
          //   expect(o.getArray()).to.be.an('array').that.has.lengthOf(3);
          // });
          // it('Expects the first element to be equal to 1.', () => {
          //   expect(o.getArray()[0]).to.be.a('number').that.is.equal(1);
          // });
          //
          // it('Expects the second element to be equal to 2.', () => {
          //   expect(o.getArray()[1]).to.be.a('number').that.is.equal(2);
          // });
          //
          // it('Expects the third element to be equal to 3.', () => {
          //   expect(o.getArray()[2]).to.be.a('number').that.is.equal(3);
          // });
        });
      });
    });
  });
};
