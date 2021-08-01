module.exports = (string = '', unique = true) => {
  const [message, ...parts] = string.split(/[ \n]+\-\-/g);
  const flags = {};

  parts.some((text) => {
    const [name, ...rest] = text.split(' ');
    if (!name) return true; // -- break flag
    const value = rest.join(' ').trim();

    const prev = flags[name];
    if (prev && value) {
      if (Array.isArray(prev)) {
        // Only include unique values
        if (!unique || !prev.includes(value)) prev.push(value);
      } else if (prev === true) { // Currently "true"? Set as value
        flags[name] = value;
      } else if (!unique || prev !== value) {  // Create a string array
        flags[name] = [prev, value]
      }
    } else if (!prev) {
      flags[name] = value || true;
    }
    return false;
  });

  return {
    message: message.trim(),
    flags,
  };
};
