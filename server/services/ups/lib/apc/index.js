const logger = require('../../../../utils/logger');
const { getDeviceExternalId, getDeviceName } = require('./externalId');
const { slugify } = require('../../../../utils/slugify');
const { DEFAULT, CONFIGURATION, UPS_TYPES } = require('../constants');
const { ServiceNotConfiguredError } = require('../../../../utils/coreErrors');

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example getApcStatus();
 */
async function getApcStatus() {
  const apcUpsData = await this.apcClient.getStatusJson();
  logger.debug(`APC data: ${JSON.stringify(apcUpsData)}`);
  return apcUpsData;
}

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example apcConnect();
 */
async function connect() {
  if (this.upsTypes[UPS_TYPES.apc].connected) {
    return;
  }
  const apcUrl = await this.gladys.variable.getValue(CONFIGURATION.apc.URL, this.serviceId);
  if (apcUrl === null) {
    throw new ServiceNotConfiguredError('UPS APC: URL is not configured');
  }
  const [ host, port ] = apcUrl.split(':');
  await this.apcClient.connect(host, port);
  this.upsTypes[UPS_TYPES.apc].connected = true;
}

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example apcConnect();
 */
async function disconnect() {
  if (!this.upsTypes[UPS_TYPES.apc].connected) {
    return;
  }
  await this.apcClient.disconnect();
  this.upsTypes[UPS_TYPES.apc].connected = false;
}

/**
 * @description Create APC devices.
 * @example apcInit();
 */
async function init() {
  this.apcClient = new this.ApcAccess();
  await connect.call(this);
  
  const apcUpsData = await getApcStatus.call(this);
  const externalId = getDeviceExternalId(apcUpsData);
  const device = this.gladys.device.stateManager.get('deviceByExternalId', externalId);

  if (!device) {
    // Create device
    const newDevice = await this.gladys.device.create({ 
      ...DEFAULT.DEVICE, 
      service_id: this.serviceId,
      external_id: externalId,
      selector: slugify(externalId),
      name: getDeviceName(apcUpsData),
    });
    logger.info(`Device APC UPS created ${newDevice.external_id}`);
  }
}

/**
 * @description Scan APC devices.
 * @returns {Promise<object>} APC UPS Daemon data.
 * @example apcScan();
 */
async function scan() {
  const apcUpsData = await getApcStatus();
  const externalId = getDeviceExternalId(apcUpsData);
  const device = this.gladys.device.stateManager.get('deviceByExternalId', externalId);
  if (device) {
    // Update device
  }
  logger.debug(`APC dat': '${JSON.stringify(apcUpsData)}`);
  return apcUpsData;
}

module.exports = {
  connect,
  disconnect,
  init,
  scan,
};
