const { UPS_TYPES } = require('./constants');

/**
 * @description Create device if not available.
 * @example
 * init();
 */
async function init() {
  this.upsData = Promise.all(Object.entries(UPS_TYPES)
    .map((value) => value[1].scan.call(this))
  );
  this.connect();
}

module.exports = {
  init,
};