const logger = require('../../utils/logger');
const MqttHandler = require('./lib');
const MqttController = require('./api/mqtt.controller');

module.exports = function MqttService(gladys, serviceId) {
  const mqtt = require('mqtt');
  const mqttHandler = new MqttHandler(gladys, mqtt, serviceId);

  /**
   * @public
   * @description This function starts service.
   * @example
   * gladys.services.mqtt.start();
   */
  async function start() {
    logger.info('Starting MQTT service');
    await mqttHandler.init();
  }

  /**
   * @public
   * @description This function stops the service.
   * @example
   *  gladys.services.mqtt.stop();
   */
  async function stop() {
    logger.info('Stopping MQTT service');
    mqttHandler.disconnect();
  }

  /**
   * @public
   * @description Test if Mqtt is used.
   * @returns {Promise<boolean>} Returns true if Mqtt is used.
   * @example
   *  const used = await gladys.services.mqtt.isUsed();
   */
  async function isUsed() {
    return mqttHandler.connected;
  }

  /**
   * @public
   * @description Get Mqtt status.
   * @returns {Promise<boolean>} Returns Mqtt status.
   * @example
   *  const used = await gladys.services.mqtt.getStatus();
   */
  async function getStatus() {
    return mqttHandler.status();
  }

  return Object.freeze({
    start,
    stop,
    isUsed,
    getStatus,
    device: mqttHandler,
    controllers: MqttController(mqttHandler),
  });
};
