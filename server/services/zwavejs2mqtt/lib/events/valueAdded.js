const { EVENTS } = require('../../../../utils/constants');
const logger = require('../../../../utils/logger');
const { GENRE, PROPERTIES } = require('../constants');
const { unbindValue } = require('../utils/bindValue');
const { getDeviceFeatureExternalId } = require('../utils/externalId');

/**
 *
 * @description Get value metadata.
 * @param {Object} zwaveNode - Node.
 * @param {Object} args - ZWaveNodeValueAddedArgs.
 * @returns {Object} ZWaveNode value metadata.
 * @example
 * getValueMetadata(9, {});
 */
function getValueMetadata(zwaveNode, args) {
  if (zwaveNode.getValueMetadata) {
    return zwaveNode.getValueMetadata(args);
  }
  return {};
}

/**
 * ValueAddedArgs.
 *
 * @description When a value is added.
 * @param {Object} zwaveNode - ZWave Node.
 * @param {Object} args - ZWaveNodeValueAddedArgs.
 * @returns {Object} None.
 * @example
 * valueAdded({id: 0}, { commandClass: 0, endpoint: 0, property: '', propertyKey: '' });
 */
function valueAdded(zwaveNode, args) {
  const { commandClass, endpoint, property, propertyKey, newValue } = args;
  const nodeId = zwaveNode.id;
  const node = this.nodes[nodeId];

  // Current value is the final state of target value
  if (property === PROPERTIES.CURRENT_VALUE) {
    args.property = PROPERTIES.TARGET_VALUE;
    args.propertyName = PROPERTIES.TARGET_VALUE;
    args.writeable = true;
    valueAdded.bind(this)(zwaveNode, args);
    return;
  }

  const fullProperty = property + (propertyKey ? `-${propertyKey}` : '');
  logger.debug(
    `Value Added: nodeId = ${nodeId}, comClass = ${commandClass}[${endpoint}], property = ${fullProperty}, value = ${newValue}`,
  );
  if (!node.classes[commandClass]) {
    node.classes[commandClass] = {};
  }
  if (!node.classes[commandClass][endpoint]) {
    node.classes[commandClass][endpoint] = {};
  }

  const metadata = getValueMetadata(zwaveNode, args);
  if ((GENRE[commandClass] || 'user') !== 'user') {
    // TODO Do not add non-user metadata, latter converted as device parameters
    return;
  }

  node.classes[commandClass][endpoint][fullProperty] = Object.assign(args, metadata, {
    genre: GENRE[commandClass] || 'user',
    // For technical use: number as key > string
    nodeId,
    commandClass,
    endpoint,
    property: fullProperty,
  });

  if (newValue) {
    const newValueUnbind = unbindValue(args, newValue);
    node.classes[commandClass][endpoint][fullProperty].value = newValueUnbind;

    if (node.ready) {
      // if (prevValue !== newValue) {
      const deviceFeatureExternalId = getDeviceFeatureExternalId({
        nodeId,
        commandClass,
        endpoint: endpoint || 0,
        property: fullProperty,
      });
      const deviceFeature = this.gladys.stateManager.get('deviceFeatureByExternalId', deviceFeatureExternalId);
      if (deviceFeature) {
        this.eventManager.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: deviceFeatureExternalId,
          state: newValueUnbind,
        });
      }
      // }
    }
  }
}

module.exports = {
  valueAdded,
};