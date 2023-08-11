const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_POLL_FREQUENCIES,
  DEVICE_FEATURE_UNITS_BY_CATEGORY,
} = require('../../../../utils/constants');
const { slugify } = require('../../../../utils/slugify');

const CONFIGURATION = {
  URL: 'UPS_APC_URL',
};

const PARAM_NAMES = {
  UPSNAME: 'UPSNAME',
  MODEL: 'MODEL',
  STATUS: 'STATUS',
  BCHARGE: 'BCHARGE',
};

const DEFAULT = {
  DEVICE: {
    should_poll: true,
    poll_frequency: DEVICE_POLL_FREQUENCIES.EVERY_MINUTES,
    features: [
      {
        name: PARAM_NAMES.STATUS,
        external_id: `ups:0:${PARAM_NAMES.BCHARGE}`,
        selector: slugify(`ups:0:${PARAM_NAMES.BCHARGE}`),
        category: DEVICE_FEATURE_CATEGORIES.TEXT,
        type: DEVICE_FEATURE_TYPES.TEXT.TEXT,
        read_only: true,
        keep_history: true,
        has_feedback: false,
        min: 0,
        max: 5,
      },
      {
        name: PARAM_NAMES.BCHARGE,
        external_id: `ups:0:${PARAM_NAMES.BCHARGE}`,
        selector: slugify(`ups:0:${PARAM_NAMES.BCHARGE}`),
        category: DEVICE_FEATURE_CATEGORIES.BATTERY,
        type: DEVICE_FEATURE_TYPES.BATTERY.INTEGER,
        read_only: true,
        keep_history: true,
        has_feedback: false,
        unit: DEVICE_FEATURE_UNITS_BY_CATEGORY[DEVICE_FEATURE_CATEGORIES.BATTERY],
        min: 0,
        max: 100,
      },
    ],
  },
};

module.exports = {
  CONFIGURATION,
  PARAM_NAMES,
  DEFAULT,
};
