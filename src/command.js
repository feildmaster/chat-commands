const join = require('./join');

const flagTemplate = {
  alias: [''],
  usage: '',
  default: '',
  description: '',
};

module.exports = class Command {
  constructor({
    title = '',
    alias = [''],
    examples = [''],
    usage = '',
    description = '',
    disabled = false,
    flags = [flagTemplate],
    handler = (context, args = [''], flags = {}) => 'Missing Handler',
  } = {}) {
    this.title = title;
    this.alias = alias.filter(_ => _.trim());
    this.examples = examples.filter(_ => _.trim());
    this.usage = usage;
    this.description = description;
    this.flags = flags.filter(_ => _.alias.filter(_ => _.trim()).length);
    this.handler = handler;
    this.disabled = disabled;
  }

  enabled(context, ...rest) {
    if (typeof this.disabled === 'function') return !this.disabled(context, ...rest);
    return !this.disabled;
  }

  handle(context, ...rest) {
    return this.handler(context, ...rest);
  }

  flag(key = '', flags = {}) {
    const flag = this.flags.find(({ alias }) => alias.includes(key));
    if (!flag) return flags[key];
    // TODO: calculate default?
    return join(flags, ...flag.alias);
  }
};

module.exports.flagTemplate = flagTemplate;
