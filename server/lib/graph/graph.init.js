const logger = require('../../utils/logger');
const prometheus = require('./graph.prometheus');
const influxdb = require('./graph.influxdb');

/**
 * @description Init Gladys Graph.
 * @example init();
 */
async function init() {
  try {
    const gladysGraphManager = await this.variable.getValue('GLADYS_GRAPH_SERVICE');
    switch (gladysGraphManager) {
      case 'prometheus':
        this.graphManager = prometheus;
        break;
      default:
        this.graphManager = influxdb;
    }    
  } catch (e) {
    logger.debug(e);
  }
}

/**
 * @description Receive a new state event and save the new state.
 * @param deviceFeature
 * @param state
 * @example
 */
async function saveState(deviceFeature, state) {
  try {
    this.graphManager.saveState(deviceFeature, state);
  } catch (e) {
    logger.debug(e);
  }
}

/**
 * @description Receive a new state event and save the new state.
 * @param deviceFeature
 * @param state
 * @param created_at
 * @example
 */
async function saveHistoricalState(deviceFeature, state, created_at) {
  try {
    this.graphManager.saveHistoricalState(deviceFeature, state, created_at);
  } catch (e) {
    logger.debug(e);
  }
}

module.exports = {
  init,
  saveState,
  saveHistoricalState,
};