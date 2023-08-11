const { UPS_TYPES } = require('./constants');

/**
 * @description Get UPS configuration.
 * @returns {Promise} Current UPS configuration.
 * @example getConfiguration();
 */
async function getConfiguration() {
  const configuration = {};
  (await Promise.all(Object.keys(UPS_TYPES)
    .map(async (type) => {
      const cfg = {};
      cfg[type] = await this[`${type}Handler`].getConfiguration();
      return cfg;
    })
  )).forEach((configurationForType) => 
    configuration[Object.keys(configurationForType)[0]] = Object.values(configurationForType)[0]
  );
  return configuration;
}

module.exports = {
  getConfiguration,
};
