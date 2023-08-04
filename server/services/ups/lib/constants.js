const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_POLL_FREQUENCIES,
} = require('../../../utils/constants');
const { slugify } = require('../../../utils/slugify');

const UPS_TYPES = {
  'apc': 'APC',
};

const CONFIGURATION = {
  apc: {
    URL: 'APC_URL'
  }
};

const PARAM_NAMES = {
  UPSNAME: 'UPSNAME',
  MODEL: 'MODEL',
};

const DEFAULT = {
  DEVICE: {
    should_poll: true,
    poll_frequency: DEVICE_POLL_FREQUENCIES.EVERY_MINUTES,
    features: [
      {
        name: 'STATUS',
        external_id: 'ups:0:STATUS',
        selector: slugify('ups:0:STATUS'),
        category: DEVICE_FEATURE_CATEGORIES.TEXT,
        type: DEVICE_FEATURE_TYPES.TEXT.TEXT,
        read_only: true,
        keep_history: true,
        has_feedback: false,
        min: 0,
        max: 5,
      },
      {
        name: 'BCHARGE',
        external_id: 'ups:0:BCHARGE',
        selector: slugify('ups:0:BCHARGE'),
        category: DEVICE_FEATURE_CATEGORIES.BATTERY,
        type: DEVICE_FEATURE_TYPES.BATTERY.INTEGER,
        read_only: true,
        keep_history: true,
        has_feedback: false,
        min: 0,
        max: 100,
      },
    ],
  },
};

module.exports = {
  UPS_TYPES,
  CONFIGURATION,
  PARAM_NAMES,
  DEFAULT,
};
