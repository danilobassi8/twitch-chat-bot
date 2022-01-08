// in this files goes all variable replacements.
// eg. $(random) is going to be replaced with a random number.

// in this replacement functions, 'this' is the param that is being sent as a parameter
const PREDEFINED = {
  random: function () {
    return (Math.random(1, 100) * 100).toFixed(2);
  },

  userFrom: function () {
    return `@${this.metadata.user.username}`;
  },
  danilo: 10,
};

const ALREADY_USED_VARS = {};

const get_prefix = (string) => {
  return `COMMAND-${string}-`;
};

module.exports = (data) => {
  // check if the variable is  pre-defined
  // if predefined, replace it
  // if not, check is in MSG_VARS
  //    if in MSG_VARS, replace it
  //    if not, add the msg value and replace it

  // Normalize the key
  let key;
  if (data.key.startsWith('$(') && data.key.endsWith(')')) {
    key = data.key.substring(2, data.key.length - 1);
  } else {
    key = data.key;
  }

  const REPLACE = PREDEFINED[key];

  const alreadyUsedKey = get_prefix(data.metadata.command);

  if (typeof REPLACE === 'function') {
    return REPLACE.call(data);
  }

  if (!REPLACE) {
    if (!!ALREADY_USED_VARS[alreadyUsedKey]) {
      return ALREADY_USED_VARS[alreadyUsedKey];
    } else {
      ALREADY_USED_VARS[alreadyUsedKey] = data.default;
      return data.default;
    }
  }
  return REPLACE;
};
