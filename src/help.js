const Command = require('./command');

const defaults = {
  title: 'Help',
  alias: ['help'],
  examples: [''],
  usage: '[command]',
  description: 'Show help text.',
  flags: [Command.flagTemplate],
  commands: [new Command()],
};

defaults.commands.shift(); // Remove the first element, it's only for reference

module.exports = class extends Command {
  constructor(config = defaults) {
    super({ ...defaults, ...config });
    this.commands = config.commands || [];
  }

  handle(context, args = []) {
    const command = (args.length && (this.commands.find((cmd) => cmd.enabled && cmd.alias.includes(args[0].toLowerCase())) || `* Command \`${args[0]}\` not found.`)) || this;
    if (!(command instanceof Command)) return command;
    const label = args.length ? args[0] : context.command;
    const prefix = context.prefix;
    const commandPrefix = `${prefix === context.mention ? '@me ' : prefix}`;
    const commandText = `${commandPrefix}${label}`;
    const embed = {
      title: `${command !== this ? `${this.title} - ` : ''}${command.title || command.alias[0]}`,
      color: 1794964,
      fields: [{
        name: '❯ Usage',
        value: `\`${commandText}${command.usage ? ` ${command.usage}` : ''}${command.flags.length ? ' [--flags...]' : ''}\``,
      }, {
        name: '❯ Aliases',
        value: command.alias.filter(a => a !== label.toLowerCase()).map(a => `\`${a}\``).join(', ') || '`None`',
      }],
    };

    if (command.description) {
      embed.description = command.description;
    }

    if (command.flags.length) {
      embed.fields.push({
        name: '❯ Flags',
        value: command.flags.map(i => `\`--${i.alias[0]}${i.usage ? ` ${i.usage}` : ''}\`${i.description ? ` - ${i.description}` : ''}${i.default ? ` (default: \`${i.default}\`)` : ''}${
          i.alias.length > 1 ? `\n • Aliases: ${i.alias.slice(1).map(a => `\`--${a}\``).join(', ')}` : ''
        }`).join('\n'),
      });
    }

    if (command.examples.length) {
      embed.fields.push({
        name: '❯ Examples',
        value: command.examples.map(a => a.replace('<command>', commandText).replace('<prefix>', commandPrefix)).join('\n'),
      });
    }

    if (!args.length && command === this) {
      embed.fields.push({
        name: '❯ Commands',
        value: this.commands.filter(_ => _ !== this)
          // .sort((a, b) => a.alias[0].localeCompare(b.alias[0], 'en', { sensitivity: 'base' }))
          .map(c => `\`${commandPrefix}${c.alias[0]}\`${c.description ? ` - ${c.description.split('\n')[0]}` : ''}`)
          .join('\n'),
      });
    }

    embed.fields.push({
      name: '❯ Legend',
      value: '`<required>, [optional], ...multiple`',
    });
    return { embed };
  }
}
