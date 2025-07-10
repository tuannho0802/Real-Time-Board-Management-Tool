function generateCode(length = 6) {
  return Math.random()
    .toString()
    .slice(2, 2 + length);
}

module.exports = generateCode;
