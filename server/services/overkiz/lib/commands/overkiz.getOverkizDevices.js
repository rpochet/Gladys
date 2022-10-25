const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_UNITS,
  DEVICE_FEATURE_TYPES,
  DEVICE_POLL_FREQUENCIES,
} = require('../../../../utils/constants');
const {
  DEVICE_ONLINE,
  DEVICE_FIRMWARE,
  DEVICE_UID_CLASSES,
  DEVICE_STATES,
  DEVICE_TYPES,
  HEATING_LEVELS,
} = require('../utils/overkiz.constants');
const { getDeviceName, getDeviceFeatureExternalId, getDeviceExternalId } = require('../utils/overkiz.externalId');

/**
 * @description Return array of Devices.
 * @returns {Promise<Array>} Return list of devices.
 * @example
 * const devices = overkizHandler.getDevices();
 */
async function getOverkizDevices() {
  const deviceOids = Object.keys(this.devices);

  const newDevices = deviceOids
    .map((deviceOid) => Object.assign({}, { id: deviceOid }, this.devices[deviceOid]))
    .filter((node) => node.type === DEVICE_TYPES.SYSTEM)
    .filter((node) => node.uiClass !== DEVICE_UID_CLASSES.POD)
    .map((node) => {
      const states = node.states.reduce((map, obj) => {
        map[obj.name] = obj.value;
        return map;
      }, {});

      const attributes = node.attributes.reduce((map, obj) => {
        map[obj.name] = obj.value;
        return map;
      }, {});

      const newDevice = {
        name: getDeviceName(node),
        model: `${states[DEVICE_STATES.MODEL_STATE]} ${states[DEVICE_STATES.POWER_STATE]}W (${
          states[DEVICE_STATES.MANUFACTURER_NAME_STATE]
        })`,
        service_id: this.serviceId,
        external_id: getDeviceExternalId(node),
        updatable: true,
        ready: node.available && node.enabled,
        rawOverkizDevice: node,
        should_poll: true,
        poll_frequency: DEVICE_POLL_FREQUENCIES.EVERY_5_MINUTES,
        features: [],
        params: [
          {
            name: DEVICE_ONLINE,
            value: states[DEVICE_STATES.STATUS_STATE],
          },
          {
            name: DEVICE_FIRMWARE,
            value: attributes[DEVICE_STATES.FIRMWARE_REVISION_STATE],
          },
        ],
      };

      return newDevice;
    })
    .reduce((map, obj) => {
      // Remove #<idx> to get all nodes from the same physical device
      map[obj.rawOverkizDevice.deviceURL.slice(0, -2)] = obj;
      return map;
    }, {});
  // foreach node in RAM, we format it with the gladys device format
  deviceOids
    .map((deviceOid) => Object.assign({}, { id: deviceOid }, this.devices[deviceOid]))
    .filter((node) => newDevices[node.deviceURL.slice(0, -2)] !== undefined)
    .map((node) => {
      const newDevice = newDevices[node.deviceURL.slice(0, -2)];
      const newFeature = {
        rawOverkizDevice: node,
      };
      if (node.uiClass === DEVICE_UID_CLASSES.HEATER) {
        newDevice.features.push(
          Object.assign({}, newFeature, {
            name: `Mode`,
            selector: `overkiz-${node.deviceURL}-${node.uiClass}-${DEVICE_STATES.HEATING_LEVEL_STATE}`,
            external_id: getDeviceFeatureExternalId(node, DEVICE_STATES.HEATING_LEVEL_STATE),
            category: DEVICE_FEATURE_CATEGORIES.THERMOSTAT,
            type: DEVICE_FEATURE_TYPES.THERMOSTAT.MODE,
            read_only: false,
            has_feedback: true,
            min: 0,
            max: HEATING_LEVELS.length - 1,
          }),
        );
        newDevice.features.push(
          Object.assign({}, newFeature, {
            name: `Comfort mode temperature`,
            selector: `overkiz-${node.deviceURL}-${node.uiClass}-${DEVICE_STATES.COMFORT_TEMPERATURE_STATE}`,
            external_id: getDeviceFeatureExternalId(node, DEVICE_STATES.COMFORT_TEMPERATURE_STATE),
            category: DEVICE_FEATURE_CATEGORIES.THERMOSTAT,
            type: DEVICE_FEATURE_TYPES.THERMOSTAT.TARGET_TEMPERATURE,
            read_only: false,
            unit: DEVICE_FEATURE_UNITS.CELSIUS,
            has_feedback: true,
            min: 0,
            max: 40,
          }),
        );
        newDevice.features.push(
          Object.assign({}, newFeature, {
            name: `Eco mode temperature`,
            selector: `overkiz-${node.deviceURL}-${node.uiClass}-${DEVICE_STATES.ECO_TEMPERATURE_STATE}`,
            external_id: getDeviceFeatureExternalId(node, DEVICE_STATES.ECO_TEMPERATURE_STATE),
            category: DEVICE_FEATURE_CATEGORIES.THERMOSTAT,
            type: DEVICE_FEATURE_TYPES.THERMOSTAT.TARGET_TEMPERATURE,
            read_only: false,
            unit: DEVICE_FEATURE_UNITS.CELSIUS,
            has_feedback: true,
            min: 0,
            max: 40,
          }),
        );
      } else if (node.uiClass === DEVICE_UID_CLASSES.TEMPERATURE) {
        newDevice.features.push(
          Object.assign({}, newFeature, {
            name: `Temperature`,
            selector: `overkiz-${node.deviceURL}-${node.uiClass}-${DEVICE_STATES.TEMPERATURE_STATE}`,
            external_id: getDeviceFeatureExternalId(node, DEVICE_STATES.TEMPERATURE_STATE),
            category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            read_only: true,
            unit: DEVICE_FEATURE_UNITS.CELSIUS,
            has_feedback: true,
            min: 0,
            max: 40,
          }),
        );
      } else if (node.uiClass === DEVICE_UID_CLASSES.OCCUPANCY) {
        newDevice.features.push(
          Object.assign({}, newFeature, {
            name: `Occupancy`,
            selector: `overkiz-${node.deviceURL}-${node.uiClass}-${DEVICE_STATES.OCCUPANCY_STATE}`,
            external_id: getDeviceFeatureExternalId(node, DEVICE_STATES.OCCUPANCY_STATE),
            category: DEVICE_FEATURE_CATEGORIES.PRESENCE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.PUSH,
            min: 0,
            max: 1,
            read_only: true,
            has_feedback: false,
            keep_history: true,
          }),
        );
      }
      
      return newDevice;
    });

  const newDevicesOids = Object.keys(newDevices);
  return newDevicesOids
    .map((newDevicesOid) => Object.assign({}, newDevices[newDevicesOid]))
    .sort(function sortByNodeReady(a, b) {
      return b.ready - a.ready || a.rawOverkizDevice.id - b.rawOverkizDevice.id;
    });
}

module.exports = {
  getOverkizDevices,
};
