module.exports = (flags = {}, ...keys) => {
  const {
    unique = true,
    default: def = false,
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

  if (!ret.length) return def;
  const res = ret.filter(v => v !== true);
  switch (res.length) {
    case 0: return true; // All true
    case 1: return res[0]; // Only one element? Return raw
    default: return res; // Results
  }
};
