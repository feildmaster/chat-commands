const parse = require('../src/flags');
const expect = require('chai').expect;

describe('parse.js', () => {
  const tests = [{
    input: 'this is a test --flag1 --flag2 --repeat --repeat -- ignore everything after this',
    expected: {
      message: 'this is a test',
      flags: {
        flag1: true,
        flag2: true,
        repeat: true,
      },
    },
  }, {
    input: '  this is a whitespace test    --foo bar',
    expected: {
      message: 'this is a whitespace test',
      flags: {
        foo: 'bar',
      },
    },
  }, {
    input: '\nthis is a\nnewline test\n--foo bar --repeat one --repeat two -- ignore everything after this',
    expected: {
      message: 'this is a\nnewline test',
      flags: {
        foo: 'bar',
        repeat: ['one', 'two'],
      },
    },
  }, {
    input: 'this is a newline flag test\n--foo bar\n--repeat one\ntwo\n--repeat three',
    expected: {
      message: 'this is a newline flag test',
      flags: {
        foo: 'bar',
        repeat: ['one\ntwo', 'three'],
      },
    },
  }];

  tests.forEach((test) => {
    const results = parse(test.input);
    const keys = Object.keys(test.expected.flags);
    
    it(`returns message: '${test.expected.message.replace(/\n/g, ' ')}'`, () => expect(results.message).to.equal(test.expected.message));
    it(`finds ${keys.length} flags`, () => expect(Object.keys(results.flags).length).to.equal(keys.length));
    it('finds flag values', () => expect(results.flags).to.deep.equal(test.expected.flags));
  });
});
