const sinon = require('sinon');

const { assert, fake } = sinon;
const UpsController = require('../../../../services/ups/api/ups.controller');

const upsManager = {};

let upsController;

describe('GET /api/v1/service/ups', () => {
  beforeEach(() => {
    upsController = UpsController(upsManager);
    sinon.reset();
  });

  it('should get status', async () => {
    const status = {
      scanInProgress: false,
    };
    const req = {};
    const res = {
      json: fake.returns(status),
    };
    upsManager.getStatus = fake.returns(status);
    await upsController['get /api/v1/service/ups/status'].controller(req, res);
    assert.calledOnce(upsManager.getStatus);
    assert.calledOnceWithExactly(res.json, status);
  });

  it('should get configuration', async () => {
    const req = {};
    const res = {
      json: fake.returns(null),
    };
    const configuration = {};
    upsManager.getConfiguration = fake.returns(configuration);
    await upsController['get /api/v1/service/ups/config'].controller(req, res);
    assert.calledOnce(upsManager.getConfiguration);
    assert.calledOnceWithExactly(res.json, configuration);
  });

  it('should save configuration', async () => {
    const configuration = {};
    const req = {
      body: configuration,
    };
    const result = true;
    const res = {
      json: fake.returns({
        success: true,
      }),
    };
    upsManager.saveConfiguration = fake.returns(result);
    upsManager.disconnect = fake.returns(null);
    upsManager.connect = fake.returns(null);
    await upsController['post /api/v1/service/ups/config'].controller(req, res);
    assert.calledOnce(upsManager.disconnect);
    assert.calledOnceWithExactly(upsManager.saveConfiguration, req.body);
    assert.calledOnce(upsManager.connect);
    assert.calledOnceWithExactly(res.json, configuration);
  });

  it('should get discovered devices', async () => {
    const req = {};
    const res = {
      json: fake.returns(null),
    };
    const devices = [];
    upsManager.getDevices = fake.returns(devices);
    await upsController['get /api/v1/service/ups/devices'].controller(req, res);
    assert.calledOnce(upsManager.getDevices);
    assert.calledOnceWithExactly(res.json, devices);
  });

  it('should scan network', async () => {
    const status = {
      scanInProgress: false,
    };
    const req = {};
    const res = {
      json: fake.returns(status),
    };
    upsManager.getStatus = fake.returns(status);
    await upsController['post /api/v1/service/ups/scan'].controller(req, res);
    assert.calledOnce(upsManager.getStatus);
    assert.calledOnceWithExactly(res.json, status);
  });
});
