const { UPS_MODE } = require('../../../../utils/constants');
const { PARAM_NAMES, STATUS } = require('../constants');

/**
 * @description Convert UPS value.
 * @param {string} name - UPS value name.
 * @param {string} value - UPS value.
 * @returns {object} Converted UPS value.
 * @example unbind('ups.status', '0L');
 */
function unbind(name, value) {
  switch (name) {
    case PARAM_NAMES.UPS_STATUS:
      switch (value) {
        case STATUS.ONLINE:
        case STATUS.ONLINE_CHARGING:
          return UPS_MODE.ONLINE;
        case STATUS.LOW_BATTERY:
          return UPS_MODE.LOW_BATTERY;
        case STATUS.ON_BATTERY:
          return UPS_MODE.ON_BATTERY;
        default:
          return UPS_MODE.UNKNOWN;
      }
    default:
      return value;
  }
}

module.exports = {
  unbind,
};
