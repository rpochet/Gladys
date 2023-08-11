const { init } = require('./init');
const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { getStatus } = require('./getStatus');
const { getConfiguration } = require('./getConfiguration');
const { saveConfiguration } = require('./saveConfiguration');
const { poll } = require('./poll');
const { scanNetwork } = require('./scanNetwork');
const { getDevices } = require('./getDevices');
const { UPS_TYPES } = require('./constants');
const { apcGetConfiguration } = require('./apc/getConfiguration');
const { apcConnect } = require('./apc/connect');
const { apcInit } = require('./apc/init');
const { apcDisconnect } = require('./apc/disconnect');
const { apcScan } = require('./apc/scan');
const APCHandler = require('./apc');

/**
 * @description Add ability to connect to a MQTT broker.
 * @param {object} gladys - Gladys instance.
 * @param {object} ApcAccess - APC module.
 * @param {string} serviceId - UUID of the service in DB.
 * @example
 * const upsHandler = new UpsHandler(gladys, serviceId);
 */
const UpsHandler = function UpsHandler(gladys, ApcAccess, serviceId) {
  this.gladys = gladys;
  this.serviceId = serviceId;

  this.upsTypes = {};

  // For each supported device type
  Object.keys(UPS_TYPES).forEach((type) => {
    this.upsTypes[type] = {
      connected: false,
    };
    this.apcHandler = new APCHandler();
    /* this[`${type}Init`] = apcInit;
    this[`${type}Connect`] = apcConnect;
    this[`${type}Disconnect`] = apcDisconnect;
    this[`${type}Scan`] = apcScan;
    this[`${type}GetConfiguration`] = apcGetConfiguration; */
  });
  this.ApcAccess = ApcAccess;
  //
};

UpsHandler.prototype.init = init;
UpsHandler.prototype.poll = poll;
UpsHandler.prototype.scanNetwork = scanNetwork;
UpsHandler.prototype.connect = connect;
UpsHandler.prototype.disconnect = disconnect;
UpsHandler.prototype.getDevices = getDevices;
UpsHandler.prototype.getStatus = getStatus;
UpsHandler.prototype.getConfiguration = getConfiguration;
UpsHandler.prototype.saveConfiguration = saveConfiguration;

module.exports = UpsHandler;
