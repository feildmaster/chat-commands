const {
  Permission,
  Constants: { Permissions },
} = require('eris');
const Command = require('./index');

module.exports = class UserCommand extends Command {
  constructor(info = {}, permissions = [
    Permissions.manageMessages,
  ]) {
    super(info);
    this.permissions = permissions
      .reduce((allow, val) => {
        if (val instanceof Permission) {
          allow |= val.allow;
        } else if (Permissions[val]) {
          allow |= Permissions[val];
        } else if (val) {
          allow |= BigInt(val);
        }
        return allow;
      }, BigInt(0));
  }

  enabled(context) {
    return context.channel.permissionsOf(context.author).has(this.permissions) &&
      super.enabled(context);
  }
};
