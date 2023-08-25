/**
 * @description Get UPS status.
 * @returns {object} Current UPS status.
 * @example getStatus();
 */
function getStatus() {
  return {
    configured: this.configured,
    connected: this.upsNut && this.upsNut.isConnected(),
  };
}

module.exports = {
  getStatus,
};
