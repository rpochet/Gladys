const {
  DEVICE_POLL_FREQUENCIES,
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_FEATURE_MINMAX_BY_TYPE,
  DEVICE_FEATURE_UNITS_BY_CATEGORY,
} = require('../../../utils/constants');
const { slugify } = require('../../../utils/slugify');
const { PARAM_NAMES } = require('./constants');
const { getDeviceName, getDeviceExternalId, getDeviceFeatureExternalId } = require('./util/externalId');

/**
 * @description Check if keyword matches value.
 * @param {string} value - Value to check.
 * @param {string} keyword - Keyword to match.
 * @returns {boolean} True if keyword matches value.
 * @example
 * const res = zwaveManager.match('test', 'te');
 */
function match(value, keyword) {
  return value ? value.toLowerCase().includes(keyword.toLowerCase()) : true;
}

/**
 * @description Get UPS devices.
 * @param {object} pagination - Filtering and ordering.
 * @param {string} pagination.orderDir - Ordering.
 * @param {string} pagination.search - Keyword to filter nodes.
 * @returns {Promise<object>} UPS devices.
 * @example getDevices();
 */
async function getDevices({ orderDir, search } = {}) {
  const nodes = await this.upsNut.getNodes();
  const nodeIds = Object.keys(nodes);
  return nodeIds
    .map((nodeId) => nodes[nodeId])
    .filter((node) => (search ? match(node[PARAM_NAMES.UPS_MODEL], search) : true))
    .map((node) => {
      const externalId = getDeviceExternalId(node);
      const newDevice = {
        service_id: this.serviceId,
        external_id: externalId,
        selector: slugify(externalId),
        name: getDeviceName(node),
        should_poll: true,
        poll_frequency: DEVICE_POLL_FREQUENCIES.EVERY_10_MINUTES,
        features: [
          {
            name: PARAM_NAMES.UPS_STATUS,
            external_id: getDeviceFeatureExternalId(node, PARAM_NAMES.UPS_STATUS),
            selector: slugify(getDeviceFeatureExternalId(node, PARAM_NAMES.UPS_STATUS)),
            category: DEVICE_FEATURE_CATEGORIES.UPS,
            type: DEVICE_FEATURE_TYPES.UPS.STATUS,
            read_only: true,
            keep_history: true,
            has_feedback: false,
            ...DEVICE_FEATURE_MINMAX_BY_TYPE[DEVICE_FEATURE_TYPES.UPS.STATUS],
          },
          {
            name: PARAM_NAMES.BATTERY_CHARGE,
            external_id: getDeviceFeatureExternalId(node, PARAM_NAMES.BATTERY_CHARGE),
            selector: slugify(getDeviceFeatureExternalId(node, PARAM_NAMES.BATTERY_CHARGE)),
            category: DEVICE_FEATURE_CATEGORIES.UPS,
            type: DEVICE_FEATURE_TYPES.UPS.BATTERY,
            read_only: true,
            keep_history: true,
            has_feedback: false,
            unit: DEVICE_FEATURE_UNITS_BY_CATEGORY[DEVICE_FEATURE_CATEGORIES.UPS][DEVICE_FEATURE_TYPES.UPS.BATTERY],
            ...DEVICE_FEATURE_MINMAX_BY_TYPE[DEVICE_FEATURE_TYPES.BATTERY.INTEGER],
          },
          {
            name: PARAM_NAMES.BATTERY_VOLTAGE,
            external_id: getDeviceFeatureExternalId(node, PARAM_NAMES.BATTERY_VOLTAGE),
            selector: slugify(getDeviceFeatureExternalId(node, PARAM_NAMES.BATTERY_VOLTAGE)),
            category: DEVICE_FEATURE_CATEGORIES.UPS,
            type: DEVICE_FEATURE_TYPES.UPS.BATTERY_VOLTAGE,
            read_only: true,
            keep_history: true,
            has_feedback: false,
            unit:
              DEVICE_FEATURE_UNITS_BY_CATEGORY[DEVICE_FEATURE_CATEGORIES.UPS][DEVICE_FEATURE_TYPES.UPS.BATTERY_VOLTAGE],
            ...DEVICE_FEATURE_MINMAX_BY_TYPE[DEVICE_FEATURE_TYPES.UPS.BATTERY],
          },
          {
            name: PARAM_NAMES.BATTERY_VOLTAGE_NOMINAL,
            external_id: getDeviceFeatureExternalId(node, PARAM_NAMES.BATTERY_VOLTAGE_NOMINAL),
            selector: slugify(getDeviceFeatureExternalId(node, PARAM_NAMES.BATTERY_VOLTAGE_NOMINAL)),
            category: DEVICE_FEATURE_CATEGORIES.UPS,
            type: DEVICE_FEATURE_TYPES.UPS.BATTERY_VOLTAGE_NOMINAL,
            read_only: true,
            keep_history: true,
            has_feedback: false,
            unit:
              DEVICE_FEATURE_UNITS_BY_CATEGORY[DEVICE_FEATURE_CATEGORIES.UPS][
                DEVICE_FEATURE_TYPES.UPS.BATTERY_VOLTAGE_NOMINAL
              ],
            ...DEVICE_FEATURE_MINMAX_BY_TYPE[DEVICE_FEATURE_TYPES.UPS.BATTERY],
          },
        ],
      };
      return newDevice;
    })
    .sort((a, b) => {
      return orderDir === 'asc' ? a.selector > b.selector : b.selector > a.selector;
    });
}

module.exports = {
  getDevices,
};
