const logger = require('../../../utils/logger');
const { UPS_TYPES } = require('./constants');

/**
 * @description Scan network.
 * @param {string} upsType - Type of UPS device to scan.
 * @example scanNetwork();
 */
async function scanNetwork(upsType) {
  try {
    if (upsType) {
      this.upsData = await Promise.all([upsType]
        .map((type) => 
          this[`${type}Handler`].scan()
        )
      );
    } else {
      this.upsData = await Promise.all(Object.keys(UPS_TYPES)
        .map((type) => 
          this[`${type}Handler`].scan()
        )
      );
    }
  } catch (e) {
    logger.error(`${e}`);
  }
}

module.exports = {
  scanNetwork,
};
