const asyncMiddleware = require('../../../api/middlewares/asyncMiddleware');

module.exports = function UpsController(upsHandler) {
  /**
   * @api {post} /api/v1/service/ups/save Save APC connection
   * @apiName save
   * @apiGroup Ups
   */
  async function connect(req, res) {
    await upsHandler.saveConfiguration(req.body);
    res.json({
      success: true,
    });
  }

  /**
   * @api {get} /api/v1/service/ups/status Get APC status.
   * @apiName status
   * @apiGroup Ups
   */
  async function status(req, res) {
    const response = upsHandler.status();
    res.json(response);
  }

  /**
   * @api {get} /api/v1/service/ups/config Get APC configuration.
   * @apiName getConfiguration
   * @apiGroup Ups
   */
  async function getConfiguration(req, res) {
    const configuration = await upsHandler.getConfiguration();
    res.json(configuration);
  }

  return {
    'post /api/v1/service/ups/connect': {
      authenticated: true,
      admin: true,
      controller: asyncMiddleware(connect),
    },
    'get /api/v1/service/ups/status': {
      authenticated: true,
      controller: status,
    },
    'get /api/v1/service/ups/config': {
      authenticated: true,
      controller: asyncMiddleware(getConfiguration),
    },
  };
};
