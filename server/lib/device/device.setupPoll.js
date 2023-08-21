const { DEVICE_POLL_FREQUENCIES } = require('../../utils/constants');

/**
 * @description Setup poll setInterval.
 * @example
 * setupPoll();
 */
function setupPoll() {
  Object.values(DEVICE_POLL_FREQUENCIES).forEach(async (pollFrequency) => {
    setInterval(this.pollAll(pollFrequency), pollFrequency);
  });
}

module.exports = {
  setupPoll,
};
