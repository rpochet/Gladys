/**
 * @description Get UPS devices.
 * @returns {object} UPS devices.
 * @example getDevices();
 */
function getDevices() {
  return this.devices;
}

module.exports = {
  getDevices,
};