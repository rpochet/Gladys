const { CONFIGURATION } = require('./constants');

/**
 * @description Get APC configuration.
 * @returns {Promise} Current APC configuration.
 * @example apcGetConfiguration();
 */
async function apcGetConfiguration() {
  const apcUrl = await this.gladys.variable.getValue(CONFIGURATION.URL, this.serviceId);

  return {
    apcUrl,
  };
}

module.exports = {
  apcGetConfiguration,
};
