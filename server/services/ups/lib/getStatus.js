/**
 * @description Get UPS status.
 * @returns {object} Current UPS status.
 * @example getStatus();
 */
function getStatus() {
  return {
    configured: true,
    connected: true,
    scanInProgress: this.scanInProgress,
  };
}

module.exports = {
  getStatus,
};
