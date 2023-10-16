const { EVENTS } = require('../../utils/constants');
const { handleDeviceNewStateEvent } = require('./presence.handleDeviceNewStateEvent');

const PresenceHandler = function PresenceHandler(event, stateManager, house) {
  this.event = event;
  this.stateManager = stateManager;
  this.house = house;
  this.userLeftWaiting = {};
  event.on(EVENTS.DEVICE.NEW_STATE, (message) => this.handleDeviceNewStateEvent(message));
};

PresenceHandler.prototype.handleDeviceNewStateEvent = handleDeviceNewStateEvent;

module.exports = PresenceHandler;
