const expect = require('chai').expect;
const flags = require('../src/flags');
const join = require('../src/join');

describe('join.js', () => {
  const tests = [{
    input: {
      text: 'Merging "truth" --+ --add',
      keys: ['+', 'add'],
    },
    expected: true, // string || true || [string]
  }, {
    input: {
      text: 'Merging text --+ foo --add bar --foo bar',
      keys: ['+', 'add'],
    },
    expected: ['foo', 'bar'],
  }, {
    input: {
      text: 'Merging text into an array --+ foo --+ bazz --add bar --foo bar',
      keys: ['+', 'add'],
    },
    expected: ['foo', 'bazz', 'bar'],
  }, {
    input: {
      text: 'Allow multiple --+ foo --add foo --foo bar',
      unique: false,
      keys: ['+', 'add'],
    },
    expected: ['foo', 'foo'],
  }, {
    input: {
      text: 'Default value --this that --the other',
      default: 'Bah',
      keys: ['+', 'add'],
    },
    expected: 'Bah',
  }];

  tests.forEach(({
    input: {
      text = '',
      keys = [''],
      unique = true,
      default: def = '',
    },
    expected,
  }) => {
    if (!Array.isArray(keys)) keys = [keys];
    const { message, flags: flagz } = flags(text, unique);
    const results = join(flagz, ...keys, {
      unique,
      default: def,
    });
    it(message, () => {
      if (Array.isArray(results)) {
        expect(results).to.deep.equal(expected);
      } else {
        expect(results).to.equal(expected);
      }
    });
  });
});