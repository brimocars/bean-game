const arrayHasDuplicates = (array) => {
  if (!array || array.length === 0) {
    return false;
  }
  const seen = new Set();
  for (const item of array) {
    if (seen.has(item)) {
      return true;
    }
    seen.add(item);
  }
  return false;
};

module.exports = {
  arrayHasDuplicates,
};
