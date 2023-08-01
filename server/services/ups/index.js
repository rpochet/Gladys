const logger = require('../../utils/logger');
const UpsController = require('./api/ups.controller');
const UpsHandler = require('./lib');

module.exports = function UpsService(gladys, serviceId) {
  const apcaccess = require('apcaccess');
  const upsHandler = new UpsHandler(gladys, apcaccess, serviceId);

  /**
   * @public
   * @description This function starts the service.
   * @example
   * gladys.services.ups.start();
   */
  async function start() {
    logger.info('Starting ups service');
    await upsHandler.init();
  }

  /**
   * @public
   * @description This function stops the service.
   * @example
   * gladys.services.ups.stop();
   */
  async function stop() {
    logger.info('Stopping ups service');
    upsHandler.disconnect();
  }

  return Object.freeze({
    start,
    stop,
    device: upsHandler,
    controllers: UpsController(upsHandler),
  });
};
