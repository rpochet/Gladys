const logger = require('../../../utils/logger');

/**
 * @description Connect to all UPS systems.
 * @example connect();
 */
async function connect() {
  logger.info('Connecting to UPS...');
  this.upsNut.connect();
}

module.exports = {
  connect,
};
