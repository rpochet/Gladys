const logger = require('../../../utils/logger');
const { UPS_TYPES } = require('./constants');

/**
 * @description Disconnect from all UPS systems.
 * @example disconnect();
 */
async function disconnect() {
  logger.info('Disconnecting to UPS...');
  this.upsData = await Promise.all(Object.keys(UPS_TYPES)
    .map((type) => 
      this[`${type}Handler`].disconnect()
    )
  );
}

module.exports = {
  disconnect,
};
