const { EVENTS } = require('../../../utils/constants');
const logger = require('../../../utils/logger');
const { MODEL, PROPERTY } = require('./sunspec.constants');
const { getDeviceFeatureExternalId } = require('./utils/sunspec.externalId');
const { ModelFactory } = require('./utils/sunspec.ModelFactory');

/**
 * @description Scan SunSpec devices.
 * @example
 * sunspec.scanDevices();
 */
async function scanDevices() {
  logger.debug(`SunSpec: Scanning devices...`);

  Object.values(this.devices)
    .filter((device) => device.mppt === undefined)
    .forEach(async (device) => {
      const values = ModelFactory.createModel(await device.modbus.readModel(device.valueModel));
      Object.entries(values).forEach((entry) => {
        const [name, value] = entry;
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: getDeviceFeatureExternalId({
            ...device,
            property: name,
          }),
          state: value,
        });
      });
    });

  Object.values(this.devices)
    .filter((device) => device.mppt !== undefined)
    .forEach(async (device) => {
      // @ts-ignore
      const { mppt } = ModelFactory.createModel(await device.modbus.readModel(MODEL.MPPT_INVERTER_EXTENSION));
      const { DCA, DCV, DCW, DCWH } = mppt[device.mppt - 1];

      this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: getDeviceFeatureExternalId({
          ...device,
          property: PROPERTY.DCA,
        }),
        state: DCA,
      });
      this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: getDeviceFeatureExternalId({
          ...device,
          property: PROPERTY.DCV,
        }),
        state: DCV,
      });
      this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: getDeviceFeatureExternalId({
          ...device,
          property: PROPERTY.DCW,
        }),
        state: DCW,
      });
      this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: getDeviceFeatureExternalId({
          ...device,
          property: PROPERTY.DCWH,
        }),
        state: DCWH,
      });
    });

  logger.debug(`SunSpec: Scanning device done`);
}

module.exports = {
  scanDevices,
};
