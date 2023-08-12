const { PARAM_NAMES } = require("../constants");

/**
 * @description Convert APC value.
 * @param {string} name - APC value name.
 * @param {string} value - APC value.
 * @returns {object} Converted APC value.
 * @example unbind('BCHARGE', '100.0 Percent');
 */
function unbind(name, value) {
  switch (name) {
    case PARAM_NAMES.UPS_STATUS:
      switch (value) {
        case 'OL':
          return 'ONLINE';
        case 'LB':
          return 'LOW_BATTERY';
        case 'OB':
          return 'ON_BATTERY';
        default:
          return 'UNKNOWN_STATUS';
      }
    default:
      return value;
  }
}

module.exports = {
  unbind,
};