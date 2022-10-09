const fs = require('fs').promises;
const path = require('path');
const isString = require('./util/isString');
const Command = require('./command');
const HelpCommand = require('./help');

const defaultCommand = new Command();

module.exports = (directory, {
  mapping = new Map([['', defaultCommand]]),
  array = [defaultCommand],
  helpCommand = true,
  helpOptions = HelpCommand.defaults,
} = {}) => {
  // Remove default mapping
  if (array.at(0) === defaultCommand) array.shift();
  // Checking for default allows alias '' to exist
  if (mapping.get('') === defaultCommand) {
    mapping.delete(''); // remove fake command
  }

  if (!directory || directory.startsWith('.')) throw new Error('Unknown directory');
  if (helpCommand && !mapping.has('help')) {
    const help = new HelpCommand({
      ...helpOptions,
      commands: array,
    });
    register(mapping, array, help);
  }
  return fs.readdir(directory)
    .then(files => files.forEach((file) => {
      if (file.startsWith('.') || file.match(/index\.js$/) || !file.endsWith('.js')) return;

      const loc = path.join(directory, file);
      const command = require(loc);
      
      // Probably a class file, skip it
      if (typeof command instanceof 'function') return;

      register(mapping, array, command, loc);
    }))
    .then(() => mapping);
};

function register(
  mapping = new Map([['', defaultCommand]]),
  array = [defaultCommand],
  command = defaultCommand,
  file = '',
) {
  if (!(command instanceof Command) || command === defaultCommand) return console.debug(`Bad file[${typeof command}]: ${file}`);
  const registered = command.alias.reduce((val, alias, i) => {
    if (isString(alias)) {
      console.debug(`${file}:alias[${i}] invalid`);
    } else if (mapping.has(alias)) {
      console.debug(`${file}:${alias} already registered`);
    } else {
      mapping.set(alias, command);
      return true;
    }
    return val;
  }, false);
  if (registered) array.push(command);
  return registered;
}
