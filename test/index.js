const { expect } = require('chai');
const DataInsert = require('../src/index');

const di = new DataInsert({});

describe('api', () => {
   it('should have a start method', () => {
      expect(di.start).to.be.a('function');
   });
});
