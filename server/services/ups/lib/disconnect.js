const logger = require('../../../utils/logger');
const { UPS_TYPES } = require('./constants');

/**
 * @description Disconnect from all UPS systems.
 * @example disconnect();
 */
async function disconnect() {
  logger.info('Disconnecting to UPS...');
  this.upsData = await Promise.all(Object.keys(UPS_TYPES)
    .map((value) => 
      require(`./${value}`).disconnect.call(this)
    )
  );
}

module.exports = {
  disconnect,
};
