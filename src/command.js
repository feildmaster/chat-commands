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
  }

  handle(context, ...rest) {
    return this.handler(context, ...rest);
  }
};

module.exports.flagTemplate = flagTemplate;
