const { promisify } = require('util');
const { CONFIGURATION, } = require('./constants');

const updateOrDestroyVariable = async (variable, key, value, serviceId) => {
  if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 0)) {
    await variable.setValue(key, value, serviceId);
  } else {
    await variable.destroy(key, serviceId);
  }
};

/**
 * @description Save MQTT configuration.
 * @param {object} configuration - MQTT configuration.
 * @param {string} [configuration.mqttUrl] - MQTT URL.
 * @param {string} [configuration.mqttUsername] - MQTT username.
 * @param {string} [configuration.mqttPassword] - MQTT password.
 * @param {boolean} [configuration.useEmbeddedBroker] - MQTT embedded broker.
 * @returns {Promise} Resolve when configuration updated & connected.
 * @example
 * saveConfiguration(configuration);
 */
async function saveConfiguration({ mqttUrl, mqttUsername, mqttPassword, useEmbeddedBroker }) {
  const { variable } = this.gladys;
  await updateOrDestroyVariable(variable, CONFIGURATION.MQTT_EMBEDDED_BROKER_KEY, useEmbeddedBroker, this.serviceId);
  await updateOrDestroyVariable(variable, CONFIGURATION.MQTT_URL_KEY, mqttUrl, this.serviceId);
  await updateOrDestroyVariable(variable, CONFIGURATION.MQTT_USERNAME_KEY, mqttUsername, this.serviceId);
  await updateOrDestroyVariable(variable, CONFIGURATION.MQTT_PASSWORD_KEY, mqttPassword, this.serviceId);

  return this.connect({ mqttUrl, mqttUsername, mqttPassword, useEmbeddedBroker });
}

module.exports = {
  saveConfiguration,
};
