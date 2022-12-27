const { STATE } = require('../../../../utils/constants');
const { COMMAND_CLASSES, SCENE_VALUES, NOTIFICATION_VALUES, SMOKE_ALARM_VALUES, PROPERTIES } = require('../constants');

/**
 * @description Bind value
 * @param {Object} valueId - Value ID.
 * @param {Object} value - Value object to send.
 * @returns {Object} Return the value adapted.
 * @example
 * const value = bindValue(6, 0x4501, 12, 1);
 */
function bindValue(valueId, value) {
  if (valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_SWITCH_BINARY) {
    return value === 1;
  }
  if (valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_SWITCH_MULTILEVEL) {
    return Number.parseInt(value, 10);
  }
  return value;
}

/**
 * @description Unbind value
 * @param {Object} valueId - Value ID.
 * @param {Object} value - Value object received.
 * @returns {Object} Return the value adapted.
 * @example
 * const value = unbindValue(6, 0x4501, 12, 1);
 */
function unbindValue(valueId, value) {
  if (
    valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_SWITCH_BINARY ||
    valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_SENSOR_BINARY
  ) {
    return value ? STATE.ON : STATE.OFF;
  }
  if (valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_NOTIFICATION) {
    if (valueId.property === PROPERTIES.MOTION) {
      return value ? STATE.ON : STATE.OFF;
    }
    if (valueId.property === PROPERTIES.MOTION_ALARM) {
      return NOTIFICATION_VALUES[value];
    }
    if (valueId.property === PROPERTIES.SMOKE_ALARM) {
      return SMOKE_ALARM_VALUES[value];
    }
  }
  if (valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_CENTRAL_SCENE) {
    return SCENE_VALUES[value % 10];
  }
  if (valueId.commandClass === COMMAND_CLASSES.COMMAND_CLASS_SCENE_ACTIVATION) {
    return SCENE_VALUES[value % 10];
  }
  return value;
}

module.exports = {
  bindValue,
  unbindValue,
};