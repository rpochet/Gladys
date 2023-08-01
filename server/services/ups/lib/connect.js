const logger = require('../../../utils/logger');
const { UPS_TYPES } = require('./constants');

/**
 * @description Connect and listen to all topics.
 * @example
 * connect();
 */
function connect() {
  logger.info('Connecting to UPS...');
  this.upsData = Promise.all(Object.entries(UPS_TYPES).map((value) => value[1].connect.call(this)));
  this.connected = true;
}

module.exports = {
  connect,
};
