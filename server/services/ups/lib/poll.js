const { DEVICE_FEATURE_TYPES, EVENTS } = require('../../../utils/constants');
const { unbind } = require('./util/bind');
const { getDeviceExternalId } = require('./util/externalId');

/**
 * @description Get device feature.
 * @param {object} device - Device to update.
 * @example poll({});
 */
async function poll(device) {
  if (!this.connected || this.upsNut === undefined) {
    return;
  }

  const nodes = await this.upsNut.getNodes();
  Object.keys(nodes)
    .map((nodeId) => nodes[nodeId])
    .forEach((node) => {
      const externalId = getDeviceExternalId(node);
      if (device.external_id === externalId) {
        const aDevice = this.gladys.device.stateManager.get('deviceByExternalId', externalId);
        if (aDevice && aDevice.features) {
          aDevice.features.forEach((feature) => {
            const value = unbind(feature.name, node[feature.name]);
            if (value !== null) {
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
      }
    });
}

module.exports = {
  poll,
};
