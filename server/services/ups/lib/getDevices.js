const { slugify } = require('../../../utils/slugify');
const { DEFAULT, PARAM_NAMES } = require('./constants');
const { getDeviceName, getDeviceExternalId } = require('./util/externalId');

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
    .map((nodeId) => 
      nodes[nodeId]
    )
    .filter((node) =>
      search
        ? match(node[PARAM_NAMES.UPS_MODEL], search)
        : true,
    )
    .map((node) => {
      const externalId = getDeviceExternalId(node);
      const newDevice = {
        ...DEFAULT.DEVICE,
        service_id: this.serviceId,
        external_id: externalId,
        selector: slugify(externalId),
        name: getDeviceName(node),
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
