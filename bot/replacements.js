const axios = require('axios').default;
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

  url: async function () {
    // get the url to fetch
    const indexOfSeparator = this.key.indexOf(':');
    const URLToFetch = this.key.slice(indexOfSeparator + 1);
    // fetch and return as string
    const res = await axios.get(URLToFetch);
    return JSON.stringify(res.data);
  },

  danilo: 10,
};

// array of arrays.
// each elements contains (key,regex)
// where key is the name of the method in PREDEFINED.
// and regex is the current regex to match
const REGEXS = [
  {
    key: 'url',
    regex: /(URL|url):( )?.+/g,
  },
];

const ALREADY_USED_VARS = {};

const getPrefix = (string) => {
  return `COMMAND-${string}-`;
};

/** This functions take a data objects that contains a key.
 * That key is going to be replaced with other value.
 * eg: userFrom --> user who send the message
 */
module.exports = async (data) => {
  // check if a variable match one of the regex in REGEXS
  //    if match, return what is supposed, else continue.
  // check if the variable is  pre-defined
  // if predefined, replace it
  // if not, check is in MSG_VARS
  //    if in MSG_VARS, replace it
  //    if not, add the msg value and replace it

  // Normalize the key
  let key;
  if (data.key.startsWith('$(') && data.key.endsWith(')')) {
    key = data.key.substring(2, data.key.length - 1);
    data.key = key;
  } else {
    key = data.key;
  }

  // TODO: refactor from here to the end. Seems to be working.
  //       but there are some code smells, and code is kind of messy

  // regex logic
  const matchRegex = REGEXS.find((regObj) => regObj.regex.test(key));
  if (matchRegex) {
    const value = PREDEFINED[matchRegex.key];
    if (typeof value === 'function') {
      data.regex = matchRegex;
      return await value.call(data);
    } else {
      return value;
    }
  }

  const REPLACE = PREDEFINED[key];
  const alreadyUsedKey = getPrefix(data.metadata.command);

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
