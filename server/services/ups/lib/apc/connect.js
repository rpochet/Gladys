const { ServiceNotConfiguredError } = require('../../../../utils/coreErrors');
const logger = require('../../../../utils/logger');
const { UPS_TYPES } = require('../constants');
const { CONFIGURATION } = require('./constants');

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example apcConnect();
 */
async function apcConnect() {
  if (this.upsTypes[UPS_TYPES.apc].connected) {
    return;
  }
  logger.info(`Connecting to APC devices...`);
  const apcUrl = await this.gladys.variable.getValue(CONFIGURATION.URL, this.serviceId);
  if (apcUrl === null) {
    throw new ServiceNotConfiguredError('UPS APC: URL is not configured');
  }
  const [host, port] = apcUrl.split(':');
  await this.apcClient.connect(host, port);
  this.upsTypes[UPS_TYPES.apc].connected = true;
}

module.exports = {
  apcConnect,
};