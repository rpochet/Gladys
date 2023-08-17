const Promise = require('bluebird');
const logger = require('../../utils/logger');
const db = require('../../models');

/**
 * @public
 * @description Get status.
 * @param {string} [podId] - Id of the pod.
 * @returns {Promise<object>} Get all services status.
 * @example
 * const usage = await service.getStatus();
 * // {zigbee: true, xiaomi: false}
 */
async function getStatus(podId = null) {
  const services = await db.Service.findAll({
    where: {
      pod_id: podId,
    },
  });

  const servicesStatus = {};

  await Promise.mapSeries(services, async (serviceInDB) => {
    try {
      const service = this.getService(serviceInDB.name);
      if (service && service.getStatus) {
        const serviceStatus = await service.getStatus();
        servicesStatus[serviceInDB.name] = {
          configured: serviceStatus.configured,
          connected: serviceStatus.connected,
          error: serviceStatus.error,
        };
      } else {
        servicesStatus[serviceInDB.name] = {
          error: 'Service status not available',
        };
      }
    } catch (e) {
      logger.warn(`Unable to get service status`, e);
      servicesStatus[serviceInDB.name] = {
        error: e,
      };
    }
  });

  return servicesStatus;
}

module.exports = {
  getStatus,
};
