const { UPS_MODE } = require('../../../../utils/constants');
const logger = require('../../../../utils/logger');
const { PARAM_NAMES, STATUS, DEFAULT } = require('../constants');

/**
 * @description Convert UPS value.
 * @param {string} name - UPS value name.
 * @param {string} value - UPS value.
 * @returns {object} Converted UPS value.
 * @example unbind('ups.status', '0L');
 */
function unbind(name, value) {
  if (name === PARAM_NAMES.UPS_STATUS) {
    const statuses = value.split(' ');
    let result = 0;
    statuses.forEach((status, idx) => {
      switch (status) {
        case STATUS.ONLINE:
          result += (10**(DEFAULT.MAX_STATUS_LENGTH - idx) * UPS_MODE.ONLINE);
          break;
        case STATUS.ON_BATTERY:
          result += (10**(DEFAULT.MAX_STATUS_LENGTH - idx) * UPS_MODE.ON_BATTERY);
          break;
        case STATUS.LOW_BATTERY:
          result += (10**(DEFAULT.MAX_STATUS_LENGTH - idx) * UPS_MODE.LOW_BATTERY);
          break;
        default:
          logger.warn(`UPS Status unknown ${status}`);
      }
    });
    return result;
  }
  return value;
}

module.exports = {
  unbind,
};
