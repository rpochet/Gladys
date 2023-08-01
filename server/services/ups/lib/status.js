/**
 * @description Get UPS status.
 * @returns {object} Current UPS status.
 * @example
 * status();
 */
function status() {
  return {
    configured: true,
    connected: this.connected,
  };
}

module.exports = {
  status,
};
