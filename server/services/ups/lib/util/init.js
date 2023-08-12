const logger = require('../../../../utils/logger');
const { slugify } = require('../../../../utils/slugify');
const { DEFAULT } = require('./constants');
const { getDeviceName, getDeviceExternalId } = require('./externalId');

/**
 * @description Create APC devices.
 * @example apcInit();
 */
async function apcInit() {
  this.apcClient = new this.ApcAccess();

  const apcUpsData = await this.getApcStatus();
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

module.exports = {
  apcInit,
};