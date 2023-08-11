const logger = require('../../../../utils/logger');
const { apcInit } = require('./init');
const { apcConnect } = require('./connect');
const { apcDisconnect } = require('./disconnect');
const { apcScan } = require('./scan');
const { apcGetConfiguration } = require('./getConfiguration');
const { apcSaveConfiguration } = require('./saveConfiguration');

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example getApcStatus();
 */
async function getApcStatus() {
  await this.connect();
  const apcUpsData = await this.apcClient.getStatusJson();
  logger.debug(`APC data: ${JSON.stringify(apcUpsData)}`);
  await this.disconnect();
  return apcUpsData;
}

const APCHandler = function APCHandler() {
  this.getApcStatus = getApcStatus;
};

APCHandler.prototype.init = apcInit;
APCHandler.prototype.connect = apcConnect;
APCHandler.prototype.disconnect = apcDisconnect;
APCHandler.prototype.scan = apcScan;
APCHandler.prototype.getConfiguration = apcGetConfiguration;
APCHandler.prototype.saveConfiguration = apcSaveConfiguration;

module.exports = APCHandler;
