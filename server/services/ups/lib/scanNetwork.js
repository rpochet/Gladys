const { DEVICE_FEATURE_TYPES, EVENTS } = require('../../../utils/constants');
const logger = require('../../../utils/logger');
const { getDeviceExternalId } = require('./apc/externalId');
const { UPS_TYPES } = require('./constants');

/**
 * @description Scan network.
 * @param {string} type Type of UPS device to scan.
 * @example scanNetwork();
 */
async function scanNetwork(type) {
  try {
    if (type) {
      this.upsData = await Promise.all([type]
        .map((value) => 
          require(`./${value}`).scan.call(this)
        )
      );
    } else {
      this.upsData = await Promise.all(Object.keys(UPS_TYPES)
        .map((value) => 
          require(`./${value}`).scan.call(this)
        )
      );
    }

    this.upsData.forEach(
      upsDevice => {
        const device = this.gladys.device.stateManager.get('deviceByExternalId', getDeviceExternalId(upsDevice));
        if (device && device.features) {
          // device.name = getupsDevice[PARAM_NAMES.UPSNAME];
          // device.model = upsDevice[PARAM_NAMES.MODEL];
          // this.gladys.device.create(device);
    
          device.features.forEach((feature) => {
            const value = upsDevice[feature.name];
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
      }
    );
  } catch (e) {
    logger.error(`${e}`);
  }
}

module.exports = {
  scanNetwork,
};
