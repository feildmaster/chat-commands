const Command = require('./index');

const glue = '\n';

const commandArray = [new Command()];
const defaults = {
  ...Command.defaults,
  title: 'Help',
  alias: ['help'],
  description: 'Show help text.',
  commands: commandArray,
};
commandArray.shift(); // Remove the first element, it's only for reference

class Help extends Command {
  constructor(config = defaults) {
    super(config);
    this.commands = validArray(config.commands) && config.commands || [];
  }

  handle(context, args = [], flags = {}) {
    const command = (args.length && (this.commands.find((cmd) => cmd.enabled(context, flags) && cmd.alias.includes(args[0].toLowerCase())) || `* Command \`${args[0]}\` not found.`)) || this;
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
      embed.description = command.description.replace(/<label>/g, label);
    }

    if (command.flags.length) {
      embed.fields.push({
        name: '❯ Flags',
        value: command.flags.map(i => [
            // `--alias[ usage]`[ description][ (default)][\n Aliases]
            `\`--${i.alias[0]}`,
            i.usage ? ` ${i.usage}` : '',
            '`',
            i.description ? ` - ${i.description.replace(/<label>/g, label)}` : '',
            i.default ? ` (default: \`${i.default}\`)` : '',
            i.alias.length > 1 ? `\n • Aliases: ${i.alias.slice(1).map(a => `\`--${a}\``).join(', ')}` : '',
        ].join('')).join(glue),
      });
    }

    if (command.examples.length) {
      embed.fields.push({
        name: '❯ Examples',
        value: command.examples.map(a => a
            .replace('<command>', commandText)
            .replace('<prefix>', prefix)
            .replace(/<label>/g, label)
          ).join(glue),
      });
    }

    if (!args.length && command === this) {
      embed.fields.push({
        name: '❯ Commands',
        value: this.commands.filter(_ => _ !== this && _.enabled(context))
          // .sort((a, b) => a.alias[0].localeCompare(b.alias[0], 'en', { sensitivity: 'base' }))
          .map(c => `\`${commandPrefix}${c.alias[0]}\`${c.description ? ` - ${c.description.split('\n')[0]}` : ''}`)
          .join(glue) || '`None`',
      });
    }

    embed.fields.push({
      name: '❯ Legend',
      value: '`<required>, [optional], ...multiple`',
    });
    return { embed };
  }
}

module.exports = Help;
Help.defaults = defaults;

function validArray(array) {
  return Array.isArray(array) && array !== commandArray;
}
