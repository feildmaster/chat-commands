module.exports = (flags = {}, ...keys) => {
  const {
    unique = true,
    default: def = '',
  } = typeof keys[keys.length - 1] === 'object' ? keys.pop() : {};
  const ret = [];
  function insert(entry) {
    if (!unique || !ret.includes(entry)) ret.push(entry);
  }
  keys.forEach((key) => {
    const data = flags[key];
    if (Array.isArray(data)) {
      data.forEach(insert);
    } else if (data) {
      insert(data);
    }
  });

  if (!ret.length) return def || false;
  let hasTrue = ret.indexOf(true);
  if (hasTrue >= 0) {
    // Is only element true?
    if (ret.length === 1) return true;
    do {
      ret.splice(hasTrue, 1); // Remove true
      hasTrue = ret.indexOf(true); // Find next
    } while(hasTrue >= 0);
    if (!ret.length) return true; // All true
  }
  // Only one element? Return raw
  if (ret.length === 1) return ret[0];
  return ret;
};
