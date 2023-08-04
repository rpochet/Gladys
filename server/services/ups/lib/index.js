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
  this.upsTypes[UPS_TYPES.apc] = {
    connected: false,
  };
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
