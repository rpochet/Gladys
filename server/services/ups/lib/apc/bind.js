const { PARAM_NAMES } = require('./constants');

/**
 * @description Convert APC value.
 * @param {string} name - APC value name.
 * @param {string} value - APC value.
 * @returns {object} Converted APC value.
 * @example unbind('BCHARGE', '100.0 Percent');
 */
function unbind(name, value) {
  switch (name) {
    case PARAM_NAMES.BCHARGE:
      return parseFloat(value.split(' ')[0]);
    default:
      return value;
  }
}

module.exports = {
  unbind,
};