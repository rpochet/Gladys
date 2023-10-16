const { assert, fake } = require('sinon');

const PresenceHandler = require('../../../lib/presence');
const { DEVICE_FEATURE_CATEGORIES } = require('../../../utils/constants');

describe('room.create', () => {
  const event = {
    emit: fake.returns(null),
    on: fake.returns(null),
  };
  const stateManager = {
    get: fake.returns({
      deviceFeatureExternalId: 'deviceFeatureExternalId',
      category: DEVICE_FEATURE_CATEGORIES.PRESENCE_SENSOR,
    }),
  };
  const house = {
    userSeen: fake.returns(null),
    userLeft: fake.returns(null),
  };
  const presenceHandler = new PresenceHandler(event, stateManager, house);

  it('should user left house', async () => {
    /* stateManager.get = stub()
      .onFirstCall()
      .returns('0')
      .onSecondCall()
      .returns('bdpvUsername')
      .onThirdCall()
      .returns('bdpvApiKey'); */
    presenceHandler.handleDeviceNewStateEvent({
      deviceFeatureExternalId: 'deviceFeatureExternalId',
      state: 0,
    });
    // expect(newRoom).to.have.property('name', 'My test room');
    // expect(newRoom).to.have.property('selector', 'my-test-room');
    assert.calledOnce(house.userLeft);
  });
});
