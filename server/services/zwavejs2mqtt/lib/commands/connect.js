const crypto = require('crypto');
const logger = require('../../../../utils/logger');

const { DEFAULT, CONFIGURATION } = require('../constants');
const { WEBSOCKET_MESSAGE_TYPES, EVENTS } = require('../../../../utils/constants');
const { generate } = require('../../../../utils/password');
const { PlatformNotCompatible } = require('../../../../utils/coreErrors');

/**
 * @description Initialize service with dependencies and connect to devices.
 * @example
 * connect();
 */
async function connect() {
  const externalZwavejs2mqtt = await this.gladys.variable.getValue(CONFIGURATION.EXTERNAL_ZWAVEJS2MQTT, this.serviceId);
  if (externalZwavejs2mqtt) {
    this.externalZwavejs2mqtt = externalZwavejs2mqtt === '1';
  } else {
    this.externalZwavejs2mqtt = DEFAULT.EXTERNAL_ZWAVEJS2MQTT;
    await this.gladys.variable.setValue(
      CONFIGURATION.EXTERNAL_ZWAVEJS2MQTT,
      this.externalZwavejs2mqtt ? '1' : '0',
      this.serviceId,
    );
  }

  // Test if dongle is present
  this.usbConfigured = false;
  if (this.externalZwavejs2mqtt) {
    logger.info(`Zwavejs2mqtt USB dongle assumed to be attached`);
    this.usbConfigured = true;
    this.driverPath = 'N.A.';
    this.mqttExist = true;
    this.zwavejs2mqttExist = true;
  } else {
    const driverPath = await this.gladys.variable.getValue(CONFIGURATION.DRIVER_PATH, this.serviceId);
    if (!driverPath) {
      logger.info(`Zwavejs2mqtt USB dongle not attached`);
    } else {
      const usb = this.gladys.service.getService('usb');
      const usbList = await usb.list();
      usbList.forEach((usbPort) => {
        if (driverPath === usbPort.path) {
          this.usbConfigured = true;
          logger.info(`Zwavejs2mqtt USB dongle attached to ${driverPath}`);
        }
      });
      this.driverPath = driverPath;
      if (!this.usbConfigured) {
        logger.info(`Zwavejs2mqtt USB dongle detached to ${driverPath}`);
      }
    }
  }

  // MQTT configuration
  const mqttPassword = await this.gladys.variable.getValue(CONFIGURATION.ZWAVEJS2MQTT_MQTT_PASSWORD, this.serviceId);
  if (!mqttPassword) {
    // First start, use default value for MQTT
    this.mqttUrl = DEFAULT.ZWAVEJS2MQTT_MQTT_URL_VALUE;
    await this.gladys.variable.setValue(CONFIGURATION.ZWAVEJS2MQTT_MQTT_URL, this.mqttUrl, this.serviceId);
    this.mqttUsername = DEFAULT.ZWAVEJS2MQTT_MQTT_USERNAME_VALUE;
    await this.gladys.variable.setValue(CONFIGURATION.ZWAVEJS2MQTT_MQTT_USERNAME, this.mqttUsername, this.serviceId);
    this.mqttPassword = generate(20, { number: true, lowercase: true, uppercase: true });
    await this.gladys.variable.setValue(CONFIGURATION.ZWAVEJS2MQTT_MQTT_PASSWORD, this.mqttPassword, this.serviceId);
    await this.gladys.variable.setValue(
      CONFIGURATION.ZWAVEJS2MQTT_MQTT_PASSWORD_BACKUP,
      this.mqttPassword,
      this.serviceId,
    );
  } else {
    const mqttUrl = await this.gladys.variable.getValue(CONFIGURATION.ZWAVEJS2MQTT_MQTT_URL, this.serviceId);
    this.mqttUrl = mqttUrl;
    const mqttUsername = await this.gladys.variable.getValue(CONFIGURATION.ZWAVEJS2MQTT_MQTT_USERNAME, this.serviceId);
    this.mqttUsername = mqttUsername;
    this.mqttPassword = mqttPassword;
  }

  // Security keys configuration
  this.s2UnauthenticatedKey = await this.gladys.variable.getValue(CONFIGURATION.S2_UNAUTHENTICATED, this.serviceId);
  if (!this.s2UnauthenticatedKey) {
    this.s2UnauthenticatedKey = crypto.randomBytes(16).toString('hex');
    await this.gladys.variable.setValue(CONFIGURATION.S2_UNAUTHENTICATED, this.s2UnauthenticatedKey, this.serviceId);
  }
  this.s2AuthenticatedKey = await this.gladys.variable.getValue(CONFIGURATION.S2_AUTHENTICATED, this.serviceId);
  if (!this.s2AuthenticatedKey) {
    this.s2AuthenticatedKey = crypto.randomBytes(16).toString('hex');
    await this.gladys.variable.setValue(CONFIGURATION.S2_AUTHENTICATED, this.s2AuthenticatedKey, this.serviceId);
  }
  this.s2AccessControlKey = await this.gladys.variable.getValue(CONFIGURATION.S2_ACCESS_CONTROL, this.serviceId);
  if (!this.s2AccessControlKey) {
    this.s2AccessControlKey = crypto.randomBytes(16).toString('hex');
    await this.gladys.variable.setValue(CONFIGURATION.S2_ACCESS_CONTROL, this.s2AccessControlKey, this.serviceId);
  }
  this.s0LegacyKey = await this.gladys.variable.getValue(CONFIGURATION.S0_LEGACY, this.serviceId);
  if (!this.s0LegacyKey) {
    this.s0LegacyKey = crypto.randomBytes(16).toString('hex');
    await this.gladys.variable.setValue(CONFIGURATION.S0_LEGACY, this.s0LegacyKey, this.serviceId);
  }

  this.dockerBased = await this.gladys.system.isDocker();
  if (this.externalZwavejs2mqtt) {
    this.mqttExist = true;
    this.mqttRunning = true;
    this.zwavejs2mqttExist = true;
    this.zwavejs2mqttRunning = true;
  } else if (this.dockerBased) {
    await this.installMqttContainer();
    if (this.usbConfigured) {
      await this.installZ2mContainer();
    }
  } else {
    throw new PlatformNotCompatible('SYSTEM_NOT_RUNNING_DOCKER');
  }

  if (this.mqttRunning) {
    this.mqttClient = this.mqtt.connect(this.mqttUrl, {
      username: this.mqttUsername,
      password: this.mqttPassword,
      // reconnectPeriod: 5000,
      // clientId: DEFAULT.MQTT_CLIENT_ID,
    });
    this.mqttConnected = this.mqttClient !== null;
  } else {
    logger.warn("Can't connect Gladys cause MQTT not running !");
  }

  if (this.mqttConnected) {
    this.mqttClient.on('connect', () => {
      logger.info('Connected to MQTT container');
      DEFAULT.TOPICS.forEach((topic) => {
        this.mqttClient.subscribe(topic);
      });
      this.mqttConnected = true;
      this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
        type: WEBSOCKET_MESSAGE_TYPES.ZWAVEJS2MQTT.STATUS_CHANGE,
      });
    });

    this.mqttClient.on('error', (err) => {
      logger.warn(`Error while connecting to MQTT - ${err}`);
      this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
        type: WEBSOCKET_MESSAGE_TYPES.ZWAVEJS2MQTT.MQTT_ERROR,
        payload: err,
      });
      this.mqttConnected = false;
    });

    this.mqttClient.on('offline', () => {
      logger.warn(`Disconnected from MQTT server`);
      this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
        type: WEBSOCKET_MESSAGE_TYPES.MQTT.ERROR,
        payload: 'DISCONNECTED',
      });
      this.mqttConnected = false;
    });

    this.mqttClient.on('message', (topic, message) => {
      try {
        this.handleMqttMessage(topic, message.toString());
      } catch (e) {
        logger.error(`Unable to process message on topic ${topic}: ${e}`);
      }
    });

    this.scanInProgress = true;

    // For testing
    /* const nodes = require('../../../../../../nodes_wil.json');
    this.handleMqttMessage(
      `${DEFAULT.ROOT}/_CLIENTS/${DEFAULT.ZWAVEJS2MQTT_CLIENT_ID}/driver/driver_ready`,
      '{"data": [{"controllerId":"controllerId","homeId":"homeId"}]}',
    );
    this.handleMqttMessage(`${DEFAULT.ROOT}/_CLIENTS/${DEFAULT.ZWAVEJS2MQTT_CLIENT_ID}/api/getNodes`, nodes);
    */

    this.mqttClient.publish(`${DEFAULT.ROOT}/_CLIENTS/${DEFAULT.ZWAVEJS2MQTT_CLIENT_ID}/api/getNodes/set`, 'true');

    this.driver = {
      ownNodeId: 'N.A.',
    };
  } else {
    logger.warn("Can't connect Gladys cause MQTT not connected !");
  }
}

module.exports = {
  connect,
};