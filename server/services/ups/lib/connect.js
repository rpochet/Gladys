const logger = require('../../../utils/logger');
const { UPS_TYPES } = require('./constants');

/**
 * @description Connect to all UPS systems.
 * @example connect();
 */
async function connect() {
  logger.info('Connecting to UPS...');
  this.upsData = await Promise.all(Object.keys(UPS_TYPES)
    .map((type) => 
      this[`${type}Handler`].connect()
    )
  );
}

module.exports = {
  connect,
};
