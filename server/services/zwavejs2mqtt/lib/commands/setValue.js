const logger = require('../../../../utils/logger');
const { DEFAULT } = require('../constants');
const { bindValue } = require('../utils/bindValue');
const { getNodeInfoByExternalId } = require('../utils/externalId');

/**
 * @description Set value.
 * @param {Object} device - The device to control.
 * @param {Object} deviceFeature - The device feature to control.
 * @param {number} value - The value to set.
 * @example
 * zwave.setValue();
 */
function setValue(device, deviceFeature, value) {
  const { nodeId, commandClass, endpoint, property, propertyKey } = getNodeInfoByExternalId(deviceFeature.external_id);
  logger.debug(`Zwave : Setting value for feature ${deviceFeature.name} of device ${nodeId}: ${value}`);
  const zwaveValue = bindValue({ nodeId, commandClass, endpoint, property, propertyKey }, value);

  this.mqttClient.publish(
    `${DEFAULT.ROOT}/nodeID_${nodeId}/${commandClass}/${endpoint}/${property}/set`,
    zwaveValue.toString(),
  );
}

module.exports = {
  setValue,
};