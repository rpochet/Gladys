const logger = require('../../../utils/logger');
const { CONFIGURATION, DEFAULT } = require('./constants');
const { ServiceNotConfiguredError } = require('../../../utils/coreErrors');
const { NutClient } = require('./nut/NutClient');

/**
 * @description Create device if not available.
 * @example
 * init();
 */
async function init() {
  const nutUrl = await this.gladys.variable.getValue(CONFIGURATION.URL, this.serviceId);
  if (!nutUrl) {
    throw new ServiceNotConfiguredError('SERVICE_NOT_CONFIGURED');
  }
  this.configured = true;
  logger.info('Initializing UPS...');

  const [nutHost = DEFAULT.NUT_HOST, nutPort = DEFAULT.NUT_PORT] = nutUrl.split(':');

  this.upsNut = new NutClient(this.Nut, nutHost, nutPort);

  this.connect();
}

module.exports = {
  init,
};
