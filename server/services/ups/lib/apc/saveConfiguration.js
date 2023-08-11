const { CONFIGURATION } = require('./constants');

/**
 * Update APC UPS Configuration.
 * @param {object} configuration - APC UPS Configuration.
 * @param {string} configuration.apcUrl - APC Url.
 * @description Update APC configuration.
 * @example apcSaveConfiguration({ apcUrl: 'localhost:3551' });
 */
async function apcSaveConfiguration({ apcUrl }) {
  await this.gladys.variable.setValue(CONFIGURATION.URL, apcUrl, this.serviceId);
}

module.exports = {
  apcSaveConfiguration,
};
