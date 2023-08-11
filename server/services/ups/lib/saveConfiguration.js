const { CONFIGURATION } = require('./apc/constants');
const { UPS_TYPES } = require('./constants');

const updateOrDestroyVariable = async (variable, key, value, serviceId) => {
  if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 0)) {
    await variable.setValue(key, value, serviceId);
  } else {
    await variable.destroy(key, serviceId);
  }
};

/**
 * @description Save UPS configuration.
 * @param {object} configuration - UPS configuration.
 * @returns {Promise} Resolve when configuration updated & connected.
 * @example saveConfiguration(configuration);
 */
async function saveConfiguration(configuration) {
  await Promise.all(Object.keys(UPS_TYPES)
    .map((type) => 
      this[`${type}SaveConfiguration`](configuration[type])
    )
  );
}

module.exports = {
  saveConfiguration,
};
