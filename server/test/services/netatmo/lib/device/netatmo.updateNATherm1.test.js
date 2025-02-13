const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;

const devicesGladys = require('../../netatmo.convertDevices.mock.test.json');
const devicesNetatmo = require('../../netatmo.loadDevices.mock.test.json');
const { EVENTS } = require('../../../../../utils/constants');
const NetatmoHandler = require('../../../../../services/netatmo/lib/index');
const logger = require('../../../../../utils/logger');

const gladys = {
  event: {
    emit: fake.resolves(null),
  },
  variable: {
    setValue: fake.resolves(null),
  },
};
const serviceId = 'serviceId';

const netatmoHandler = new NetatmoHandler(gladys, serviceId);

describe('Netatmo update NATherm1 features', () => {
  const deviceGladys = devicesGladys[1];
  const deviceNetatmoNATherm1 = JSON.parse(JSON.stringify(devicesNetatmo[1]));
  const externalIdNATherm1 = `netatmo:${devicesNetatmo[1].id}`;
  beforeEach(() => {
    sinon.reset();

    netatmoHandler.status = 'not_initialized';
  });

  afterEach(() => {
    sinon.reset();
  });

  it('should save all values according to all cases', async () => {
    await netatmoHandler.updateNATherm1(deviceGladys, deviceNetatmoNATherm1, externalIdNATherm1);

    expect(netatmoHandler.gladys.event.emit.callCount).to.equal(7);
    sinon.assert.calledWith(netatmoHandler.gladys.event.emit, 'device.new-state', {
      device_feature_external_id: `${deviceGladys.external_id}:battery_percent`,
      state: 60,
    });
    expect(
      netatmoHandler.gladys.event.emit.getCall(0).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:battery_percent',
        state: 60,
      }),
    ).to.equal(true);
    expect(
      netatmoHandler.gladys.event.emit.getCall(1).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:temperature',
        state: 19.6,
      }),
    ).to.equal(true);
    expect(
      netatmoHandler.gladys.event.emit.getCall(2).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:therm_measured_temperature',
        state: 19.4,
      }),
    ).to.equal(true);
    expect(
      netatmoHandler.gladys.event.emit.getCall(3).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:therm_setpoint_temperature',
        state: 19.5,
      }),
    ).to.equal(true);
    expect(
      netatmoHandler.gladys.event.emit.getCall(4).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:open_window',
        state: 0,
      }),
    ).to.equal(true);
    expect(
      netatmoHandler.gladys.event.emit.getCall(5).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:rf_strength',
        state: 60,
      }),
    ).to.equal(true);
    expect(
      netatmoHandler.gladys.event.emit.getCall(6).calledWith(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: 'netatmo:04:00:00:xx:xx:xx:boiler_status',
        state: 1,
      }),
    ).to.equal(true);
  });
  it('should handle errors correctly', async () => {
    deviceNetatmoNATherm1.battery_percent = undefined;
    const error = new Error('Test error');
    netatmoHandler.gladys = {
      event: {
        emit: sinon.stub().throws(error),
      },
    };
    sinon.stub(logger, 'error');

    try {
      await netatmoHandler.updateNATherm1(deviceGladys, deviceNetatmoNATherm1, externalIdNATherm1);
    } catch (e) {
      expect(e).to.equal(error);
      sinon.assert.calledOnce(logger.error);
    }

    logger.error.restore();
  });
});
