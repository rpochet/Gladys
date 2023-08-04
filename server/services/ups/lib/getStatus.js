/**
 * @description Get UPS status.
 * @returns {object} Current UPS status.
 * @example getStatus();
 */
function getStatus() {
  return {
    configured: true,
    scanInProgress: this.scanInProgress,
  };
}

module.exports = {
  getStatus,
};
