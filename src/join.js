module.exports = (flags, ...keys) => {
  const ret = [];
  function insert(entry) {
    if (!ret.includes(entry)) ret.push(entry);
  }
  keys.forEach((key) => {
    const data = flags[key];
    if (Array.isArray(data)) {
      data.forEach(insert);
    } else if (data) {
      insert(data);
    }
  });

  if (!ret.length) return false;
  const hasTrue = ret.indexOf(true);
  if (hasTrue >= 0) {
    // Is only element true?
    if (ret.length === 1) return true;
    ret.splice(hasTrue, 1); // Remove true
  }
  // Only one element? Return raw
  if (ret.length === 1) return ret[0];
  return ret;
};
