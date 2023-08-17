const { init } = require('./init');
const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { getStatus } = require('./getStatus');
const { getConfiguration } = require('./getConfiguration');
const { saveConfiguration } = require('./saveConfiguration');
const { poll } = require('./poll');
const { getDevices } = require('./getDevices');

/**
 * @description Add ability to connect to a MQTT broker.
 * @param {object} gladys - Gladys instance.
 * @param {object} Nut - Nut module.
 * @param {string} serviceId - UUID of the service in DB.
 * @example
 * const upsHandler = new UpsHandler(gladys, serviceId);
 */
const UpsHandler = function UpsHandler(gladys, Nut, serviceId) {
  this.gladys = gladys;
  this.serviceId = serviceId;

  this.Nut = Nut;
  this.configured = false;
  this.connected = false;
  //
};

UpsHandler.prototype.init = init;
UpsHandler.prototype.poll = poll;
UpsHandler.prototype.connect = connect;
UpsHandler.prototype.disconnect = disconnect;
UpsHandler.prototype.getDevices = getDevices;
UpsHandler.prototype.getStatus = getStatus;
UpsHandler.prototype.getConfiguration = getConfiguration;
UpsHandler.prototype.saveConfiguration = saveConfiguration;

module.exports = UpsHandler;
