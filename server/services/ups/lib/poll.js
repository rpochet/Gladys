const logger = require('../../../utils/logger');
const { EVENTS, DEVICE_FEATURE_TYPES } = require('../../../utils/constants');
const { DEFAULT, PARAM_NAMES, UPS_TYPES } = require('./constants');

/**
 * @description Scan devices.
 * @example
 * poll();
 */
async function poll() {
  try {
    this.upsData = Promise.all(Object.entries(UPS_TYPES)
      .map((value) => value[1].scan.call(this))
    );

    const device = this.gladys.device.stateManager.get('device', DEFAULT.DEVICE.selector);
    if (device && device.features) {
      device.name = this.upsData[PARAM_NAMES.UPSNAME]; 
      device.model = this.upsData[PARAM_NAMES.MODEL];
      // this.gladys.device.create(device);  

      device.features.forEach(feature => {
        const value = this.upsData[feature.name];
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

  } catch (e) {
    logger.error(`${e}`);
  }
}

module.exports = {
  poll,
};
