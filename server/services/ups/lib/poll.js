/**
 * @description Scan devices.
 * @example
 * poll();
 */
async function poll() {
  this.scanNetwork();
}

module.exports = {
  poll,
};
