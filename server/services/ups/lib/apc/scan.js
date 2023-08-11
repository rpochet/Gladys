const { DEVICE_FEATURE_TYPES, EVENTS } = require('../../../../utils/constants');
const logger = require('../../../../utils/logger');

/**
 * @description Scan APC devices.
 * @returns {Promise<object>} APC UPS Daemon data.
 * @example apcScan();
 */
async function apcScan() {
  const apcUpsData = await this.getApcStatus();
  const externalId = this.getDeviceExternalId(apcUpsData);
  const device = this.gladys.device.stateManager.get('deviceByExternalId', externalId);
  if (device && device.features) {
    device.features.forEach((feature) => {
      const value = this.unbind(feature.name, apcUpsData[feature.name]);
      if (value) {
        const event = {
          device_feature_external_id: feature.external_id,
        };
        if (feature.type === DEVICE_FEATURE_TYPES.TEXT.TEXT) {
          event.text = value;
        } else {
          event.state = value;
        }
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, event);
      }
    });
  }
  logger.debug(`APC data: ${JSON.stringify(apcUpsData)}`);
}

module.exports = {
  apcScan,
};