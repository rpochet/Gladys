const { expect } = require('chai');
const sinon = require('sinon');

const { fake, assert } = sinon;

const Service = require('../../../lib/service');
const StateManager = require('../../../lib/state');
const db = require('../../../models');

const services = {};
const serviceName = 'fake-service';

describe('service.getStatus', () => {
  let serviceImpl;
  let stateManager;
  let service;

  beforeEach(async () => {
    serviceImpl = {
      selector: serviceName,
      name: serviceName,
      version: '0.1.0',
    };

    stateManager = new StateManager();
    stateManager.setState('service', serviceName, serviceImpl);
    service = new Service(services, stateManager);

    await db.Service.create(serviceImpl);
  });

  afterEach(async () => {
    sinon.reset();
  });

  it('should return that service is not configured', async () => {
    serviceImpl.getStatus = fake.resolves({
      configured: false,
    });

    const result = await service.getStatus();

    expect(result).to.deep.equal({
      'fake-service': {
        configured: false,
      },
    });
    assert.calledOnce(serviceImpl.getStatus);
  });

  it('should return that service is configured', async () => {
    serviceImpl.getStatus = fake.resolves({
      configured: true,
    });

    const result = await service.getStatus();

    expect(result).to.deep.equal({
      'fake-service': {
        connected: true,
      },
    });
    assert.calledOnce(serviceImpl.getStatus);
  });
  it('should return empty, service has not a getStatus function', async () => {
    const result = await service.getStatus();

    expect(result).to.deep.equal({});
  });
  it('should return empty, service getStatus is crashing', async () => {
    serviceImpl.getStatus = fake.rejects('ERROR');

    const result = await service.getStatus();

    expect(result).to.deep.equal({});
    assert.calledOnce(serviceImpl.getStatus);
  });
});
