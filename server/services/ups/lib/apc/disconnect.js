const logger = require('../../../../utils/logger');
const { UPS_TYPES } = require('../constants');

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example apcDisconnect();
 */
async function apcDisconnect() {
  if (!this.upsTypes[UPS_TYPES.apc].connected) {
    return;
  }
  logger.info(`Disonnecting from APC devices...`);
  await this.apcClient.disconnect();
  this.upsTypes[UPS_TYPES.apc].connected = false;
}

module.exports = {
  apcDisconnect,
};
