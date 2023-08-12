const { DEVICE_FEATURE_TYPES, EVENTS } = require("../../../utils/constants");
const { unbind } = require("./util/bind");
const { getDeviceExternalId } = require("./util/externalId");

/**
 * @description Get device feature.
 * @param {object} device - Device to update.
 * @example poll({});
 */
async function poll(device) {
  const nodes = await this.upsNut.getNodes();
  Object.keys(nodes)
    .map((nodeId) => 
      nodes[nodeId]
    )
    .forEach((node) => {
      const externalId = getDeviceExternalId(node);
      if (device.external_id === externalId) {
        const _device = this.gladys.device.stateManager.get('deviceByExternalId', externalId);
        if (_device && _device.features) {
          _device.features.forEach((feature) => {
            const value = unbind(feature.name, node[feature.name]);
            if (value) {
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
    })
    ;
}

module.exports = {
  poll,
};
