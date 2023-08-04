const asyncMiddleware = require('../../../api/middlewares/asyncMiddleware');

module.exports = function UpsController(upsHandler) {

  /**
   * @api {get} /api/v1/service/ups/devices Get UPS devices.
   * @apiName getDevices
   * @apiGroup Ups
   */
  async function getDevices(req, res) {
    const response = await upsHandler.getDevices();
    res.json(response);
  }

  /**
   * @api {get} /api/v1/service/ups/status Get UPS status.
   * @apiName getStatus
   * @apiGroup Ups
   */
  async function getStatus(req, res) {
    const response = await upsHandler.getStatus();
    res.json(response);
  }

  /**
   * @api {get} /api/v1/service/ups/config Get UPS configuration.
   * @apiName getConfiguration
   * @apiGroup Ups
   */
  async function getConfiguration(req, res) {
    const configuration = await upsHandler.getConfiguration();
    res.json(configuration);
  }

  /**
   * @api {post} /api/v1/service/ups/config Save UPS configuration.
   * @apiName saveConfiguration
   * @apiGroup Ups
   */
  async function saveConfiguration(req, res) {
    await upsHandler.disconnect();
    await upsHandler.saveConfiguration(req.body);
    await upsHandler.connect();
    const configuration = await upsHandler.getConfiguration();
    res.json(configuration);
  }

  /**
   * @api {post} /api/v1/service/ups/scan Scan UPS network.
   * @apiName scanNetwork
   * @apiGroup Ups
   */
  async function scanNetwork(req, res) {
    upsHandler.scanNetwork(req.type);
    return getStatus(req, res);
  }

  return {
    'get /api/v1/service/ups/devices': {
      authenticated: true,
      controller: asyncMiddleware(getDevices),
    },
    'get /api/v1/service/ups/status': {
      authenticated: true,
      controller: asyncMiddleware(getStatus),
    },
    'get /api/v1/service/ups/config': {
      authenticated: true,
      controller: asyncMiddleware(getConfiguration),
    },
    'post /api/v1/service/ups/config': {
      authenticated: true,
      controller: asyncMiddleware(saveConfiguration),
    },
    'post /api/v1/service/ups/scan': {
      authenticated: true,
      controller: asyncMiddleware(scanNetwork),
    },
  };
};
