const { init } = require('./init');
const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { status } = require('./status');
const { getConfiguration } = require('./getConfiguration');
const { saveConfiguration } = require('./saveConfiguration');
const { poll } = require('./poll');

/**
 * @description Add ability to connect to a MQTT broker.
 * @param {object} gladys - Gladys instance.
 * @param {object} apcaccessLibrary - apcaccess lib.
 * @param {string} serviceId - UUID of the service in DB.
 * @example
 * const upsHandler = new UpsHandler(gladys, client, serviceId);
 */
const UpsHandler = function UpsHandler(gladys, apcaccessLibrary, serviceId) {
  this.gladys = gladys;
  this.apcaccessLibrary = apcaccessLibrary;
  this.serviceId = serviceId;
  this.connected = false;
};

UpsHandler.prototype.init = init;
UpsHandler.prototype.poll = poll;
UpsHandler.prototype.connect = connect;
UpsHandler.prototype.disconnect = disconnect;
UpsHandler.prototype.status = status;
UpsHandler.prototype.getConfiguration = getConfiguration;
UpsHandler.prototype.saveConfiguration = saveConfiguration;

module.exports = UpsHandler;
