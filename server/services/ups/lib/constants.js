const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_POLL_FREQUENCIES,
} = require('../../../utils/constants');
const { slugify } = require('../../../utils/slugify');
const { apcConnect, apcInit, apcScan } = require('./apc');

const UPS_TYPES = {
  APC: {
    connect: apcConnect,
    init: apcInit,
    scan: apcScan,
  },
};

const PARAM_NAMES = {
  UPSNAME: 'UPSNAME',
  MODEL: 'MODEL',
};

const DEFAULT = {
  DEVICE: {
    external_id: 'ups:0',
    selector: 'ups-0',
    name: 'UPS',
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
  PARAM_NAMES,
  DEFAULT,
};
