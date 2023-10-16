const db = require('../../models');
const { DEVICE_FEATURE_CATEGORIES } = require('../../utils/constants');

/**
 * @description Check is a user is associated to the device feature.
 * @param {object} event - The event to send.
 * @param {string} event.device_feature_external_id - The device feature.
 * @param {*} event.state - The device feature state value.
 * @example
 * handleDeviceNewStateEvent({ device_feature_external_id: '', state: 0 })
 */
async function handleDeviceNewStateEvent({ device_feature_external_id: deviceFeatureExternalId, state }) {
  const deviceFeature = this.stateManager.get('deviceFeatureByExternalId', deviceFeatureExternalId);
  if (deviceFeature && deviceFeature.category === DEVICE_FEATURE_CATEGORIES.PRESENCE_SENSOR) {
    const users = await db.User.findAll();
    const userInHouse = {};
    users.forEach(async (user) => {
      if (user.presence_device_features) {
        userInHouse[user.selector] = {};
        user.presence_device_features
          .filter((presenceDevice) => presenceDevice.device_feature_external_id === deviceFeatureExternalId)
          .forEach((presenceDevice) => {
            if (
              !userInHouse[user.selector][presenceDevice.house] ||
              userInHouse[user.selector][presenceDevice.house] === (state !== 1)
            ) {
              userInHouse[user.selector][presenceDevice.house] = state === 1;
            }
          });
      }
    });
    Object.entries(userInHouse).forEach(([user, houseState]) => {
      Object.entries(houseState).forEach(async ([house, seen]) => {
        if (seen) {
          await this.house.userSeen(house, user);
          if (this.userLeftWaiting[user]) {
            clearTimeout(this.userLeftWaiting[user]);
            delete this.userLeftWaiting[user];
          }
        } else {
          this.userLeftWaiting[user] = setTimeout(async () => {
            await this.house.userLeft(house, user);
            delete this.userLeftWaiting[user];
          }, 60 * 1000);
        }
      });
    });
  }
}

module.exports = {
  handleDeviceNewStateEvent,
};
