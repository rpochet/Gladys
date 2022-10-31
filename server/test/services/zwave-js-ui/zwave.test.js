const sinon = require('sinon');

const { expect } = require('chai');

const { fake } = sinon;

const ZwaveJSUIService = require('../../../services/zwave-js-ui/index');

const ZWAVEJSUI_SERVICE_ID = 'ZWAVEJSUI_SERVICE_ID';
const DRIVER_PATH = 'DRIVER_PATH';

const event = {
  emit: fake.resolves(null),
};

const gladys = {
  event,
  service: {
    getService: () => {
      return {
        list: () => Promise.resolve([DRIVER_PATH]),
      };
    },
  },
  variable: {
    getValue: fake.resolves(true),
    setValue: fake.resolves(true),
  },
  system: {
    isDocker: fake.resolves(true),
  },
  installMqttContainer: fake.returns(true),
  installZ2mContainer: fake.returns(true),
};

describe('zwaveJSUIService', () => {
  const zwaveJSUIService = ZwaveJSUIService(gladys, ZWAVEJSUI_SERVICE_ID);

  beforeEach(() => {
    sinon.reset();
  });

  it('should have controllers', () => {
    expect(zwaveJSUIService)
      .to.have.property('controllers')
      .and.be.instanceOf(Object);
  });
  it('should start service', async () => {
    gladys.variable.getValue = sinon.stub();
    gladys.variable.getValue
      .onFirstCall() // EXTERNAL_ZWAVEJSUI
      .resolves('1')
      .onSecondCall() // DRIVER_PATH
      .resolves(DRIVER_PATH);
    await zwaveJSUIService.start();
    expect(zwaveJSUIService.device.mqttConnected).to.equal(true);
  });
  it('should stop service', async () => {
    await zwaveJSUIService.stop();
    expect(zwaveJSUIService.device.mqttConnected).to.equal(false);
  });
});