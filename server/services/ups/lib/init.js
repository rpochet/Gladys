const { UPS_TYPES } = require('./constants');

/**
 * @description Create device if not available.
 * @example
 * init();
 */
async function init() {
  this.upsData = await Promise.all(Object.keys(UPS_TYPES)
    .map((value) => 
      require(`./${value}`).init.call(this)
    )
  );
  await this.connect();
}

module.exports = {
  init,
};
