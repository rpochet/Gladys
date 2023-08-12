const logger = require('../../../utils/logger');
const { CONFIGURATION } = require('./constants');
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
  
  const [ nutHost = '192.168.1.4', nutPort = 3493 ] = nutUrl.split(':');
  
  this.upsNut = new NutClient(this.Nut, nutHost, nutPort);

  this.connect();
}

module.exports = {
  init,
};
