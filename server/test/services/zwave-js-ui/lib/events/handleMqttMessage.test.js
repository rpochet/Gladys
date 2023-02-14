const sinon = require('sinon');
const ZwaveJSUIManager = require('../../../../../services/zwave-js-ui/lib');
const { DEFAULT } = require('../../../../../services/zwave-js-ui/lib/constants');

const { assert, fake } = sinon;

const ZWAVEJSUI_SERVICE_ID = 'ZWAVEJSUI_SERVICE_ID';
const event = {
  emit: fake.resolves(null),
};
const mqtt = fake.resolves(null);

describe('zwave gladys node event', () => {
  let gladys;
  let zwaveJSUIManager;
  let node;

  before(() => {
    gladys = {
      event,
    };
    zwaveJSUIManager = new ZwaveJSUIManager(gladys, mqtt, ZWAVEJSUI_SERVICE_ID);
    zwaveJSUIManager.mqttConnected = true;
  });

  beforeEach(() => {
    node = {
      id: 1,
      ready: true,
      classes: {},
    };
    zwaveJSUIManager.nodes = {
      '1': node,
    };
    zwaveJSUIManager.scanInProgress = false;
    zwaveJSUIManager.valueUpdated = fake.returns(null);
    // sinon.reset();
  });

  it('should default _CLIENTS', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/_CLIENTS`, null);
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });

  it('should default status', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/???/status`, null);
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });

  it('should default nodeinfo', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/???/nodeinfo`, null);
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });

  it('should default scanInProgress', () => {
    zwaveJSUIManager.scanInProgress = true;
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/???`, null);
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });

  it('should default set', () => {
    zwaveJSUIManager.scanInProgress = true;
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeId/commandClass/endpoint/propertyName/set`, null);
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });

  it('should default not supported commandClass', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeId/112/endpoint/propertyName/set`, null);
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });

  it('should update node empty message', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeID_1/0/0/propertyName/propertyKey`, '');
    assert.calledOnceWithExactly(
      zwaveJSUIManager.valueUpdated,
      {
        id: 1,
      },
      {
        commandClass: 0,
        endpoint: 0,
        property: 'propertyName',
        propertyKey: 'propertyKey',
        newValue: '',
      },
    );
  });

  it('should default node true message', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeID_1/0/0/propertyName/propertyKey`, 'true');
    assert.calledOnce(zwaveJSUIManager.valueUpdated);
    /* assert.calledOnceWithExactly(zwaveJSUIManager.valueUpdated, {
      id: 1,
    },
    {
      commandClass: 0,
      endpoint: 0,
      property: 'propertyName',
      propertyKey: 'propertyKey',
      newValue: true,
    }); */
  });

  it('should default node false message', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeID_1/0/0/propertyName/propertyKey`, 'false');
    assert.calledOnce(zwaveJSUIManager.valueUpdated);
    /* assert.calledOnceWithExactly(zwaveJSUIManager.valueUpdated, {
      id: 1,
    },
    {
      commandClass: 0,
      endpoint: 0,
      property: 'propertyName',
      propertyKey: 'propertyKey',
      newValue: false,
    }); */
  });

  it('should default node number message', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeID_1/0/0/propertyName/propertyKey`, '1');
    assert.calledOnce(zwaveJSUIManager.valueUpdated);
    /* assert.calledOnceWithExactly(zwaveJSUIManager.valueUpdated, {
      id: 1,
    },
    {
      commandClass: 0,
      endpoint: 0,
      property: 'propertyName',
      propertyKey: 'propertyKey',
      newValue: 1,
    }); */
  });

  it('should default node not a number message', () => {
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/nodeID_1/0/0/propertyName/propertyKey`, '???');
    assert.notCalled(zwaveJSUIManager.valueUpdated);
  });
});

describe('zwave event', () => {
  let gladys;
  let zwaveJSUIManager;

  before(() => {
    gladys = {
      event,
    };
    zwaveJSUIManager = new ZwaveJSUIManager(gladys, mqtt, ZWAVEJSUI_SERVICE_ID);
    zwaveJSUIManager.mqttConnected = true;
    zwaveJSUIManager.driver = {};
    zwaveJSUIManager.scanComplete = fake.returns(null);
  });

  beforeEach(() => {
    sinon.reset();
  });

  it('should send driver status event', () => {
    const message = {};
    zwaveJSUIManager.handleMqttMessage(`${DEFAULT.ROOT}/driver/status`, JSON.stringify(message));
    assert.notCalled(event.emit);
  });
});

describe('zwave node event', () => {
  let gladys;
  let zwaveJSUIManager;
  let node;

  before(() => {
    gladys = {
      event,
    };
    zwaveJSUIManager = new ZwaveJSUIManager(gladys, mqtt, ZWAVEJSUI_SERVICE_ID);
    zwaveJSUIManager.mqttConnected = true;
    zwaveJSUIManager.valueAdded = fake.returns(null);
  });

  beforeEach(() => {
    node = {
      id: 1,
    };
    zwaveJSUIManager.nodes = {
      '1': node,
    };
    sinon.reset();
  });
});