const logger = require('../../../utils/logger');

/**
 * @description Disconnect from all UPS systems.
 * @example disconnect();
 */
async function disconnect() {
  logger.info('Disconnecting to UPS...');
  if (this.upsNut !== undefined) {
    this.upsNut.close();
  }
}

module.exports = {
  disconnect,
};
