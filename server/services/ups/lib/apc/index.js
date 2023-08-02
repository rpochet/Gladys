const { spawn } = require('child_process');
const logger = require('../../../../utils/logger');
const { getDeviceExternalId } = require('./externalId');
const { DEFAULT } = require('../constants');

const promise = new Promise((resolve, reject) => {
  let text = '';
  let err = '';
  const childProcess = spawn('apcaccess');
  childProcess.stdout.on('data', async (data) => {
    text += data.toString();
  });

  childProcess.stderr.on('data', (data) => {
    err += data;
  });

  childProcess.on('close', (code) => {
    if (code !== 0) {
      const error = new Error(err);
      reject(error);
    } else {
      resolve(text);
    }
  });
});

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example getApcStatus();
 */
async function getApcStatus() {
  const apcUpsData = {};
  (await promise)
    .trim()
    .split('\n')
    .forEach(line => {
      const entry = line.split(':');
      apcUpsData[entry[0].trim()] = entry[1].trim();
    });
  logger.debug(`APC data: ${JSON.stringify(apcUpsData)}`);
  return apcUpsData;
}

/**
 * @description Connect to APC daemon.
 * @returns {Promise} APC UPS Daemon data.
 * @example apcConnect();
 */
async function apcConnect() {
  await getApcStatus();
}

/**
 * @description Create APC devices.
 * @returns {Promise<object>} APC UPS Daemon data.
 * @example apcInit();
 */
async function apcInit() {
  const apcUpsData = await getApcStatus();
  const externalId = getDeviceExternalId(apcUpsData);
  const device = this.gladys.device.stateManager.get('deviceByExternalId', externalId);
  if (!device) {
    const newDevice = await this.gladys.device.create({ ...DEFAULT.DEVICE, 
      service_id: this.serviceId,
    });
    logger.info(`Device APC UPS created ${newDevice.external_id}`);
  }
  return apcUpsData;
}

/**
 * @description Scan APC devices.
 * @returns {Promise<object>} APC UPS Daemon data.
 * @example apcScan();
 */
async function apcScan() {
  const apcUpsData = await getApcStatus();
  const externalId = getDeviceExternalId(apcUpsData);
  const device = this.gladys.device.stateManager.get('deviceByExternalId', externalId);
  if (device) {
    
  }
  logger.debug(`APC data: ${JSON.stringify(apcUpsData)}`);
  return apcUpsData;
}

module.exports = {
  apcConnect,
  apcInit,
  apcScan,
};