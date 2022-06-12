const {getFunction} = require('@google-cloud/functions-framework/testing');
const chai = require('chai');
chai.use(chaiHttp);

describe('functions_mutant_http', () => {
  const sinon = require('sinon');
  const assert = require('assert');
  require('../is_mutant');

  const getMocks = () => {
    const req = {body: {}, query: {}};

    return {
      req: req,
      res: {
        send: this,
      },
    };
  };

  it('Mutant: Validate mutant with fake data', async () => {
    const mocks = getMocks();
    mocks.req.body = {dna: ["ATGCGA","CAGTGC","TTATBT","AGAAGG","CCCCTA","TCACTG"]};

    const mutant = getFunction('mutant');
    await mutant(mocks.req, mocks.res)
    assert.strictEqual(mocks.res.send.calledOnceWith(true), true);
  });
});
