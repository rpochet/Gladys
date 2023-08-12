const { DEVICE_POLL_FREQUENCIES, DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES, DEVICE_FEATURE_UNITS_BY_CATEGORY } = require("../../../utils/constants");
const { slugify } = require('../../../utils/slugify');

const UPS_TYPES = {
  apc: 'APC',
};

const CONFIGURATION = {
  URL: 'UPS_NUT_URL',
};

const PARAM_NAMES = {
  BATTERY_CHARGE: 'battery.charge',
  BATTERY_CHARGE_LOW: 'battery.charge.low',
  BATTERY_RUNTIME: 'battery.runtime',
  BATTERY_TYPE: 'battery.type',
  DEVICE_MFR: 'device.mfr',
  DEVICE_MODEL: 'device.model',
  DEVICE_SERIAL: 'device.serial',
  DEVICE_TYPE: 'device.type',
  DRIVER_NAME: 'driver.name',
  DRIVER_PARAMETER_POLL_FREQ: 'driver.parameter.pollfreq',
  DRIVER_PARAMETER_POLL_INTERVAL: 'driver.parameter.pollinterval',
  DRIVER_PARAMETER_PORT: 'driver.parameter.port',
  DRIVER_VERSION: 'driver.version',
  DRIVER_VERSION_DATA: 'driver.version.data',
  DRIVER_VERSION_INTERNAL: 'driver.version.internal',
  INPUT_SENSITIVITY: 'input.sensitivity',
  INPUT_TRANSFER_BOOST_LOW: 'input.transfer.boost.low',
  INPUT_TRANSFER_HIGH: 'input.transfer.high',
  INPUT_TRANSFER_LOW: 'input.transfer.low',
  INPUT_TRANSFER_TRIM_HIGH: 'input.transfer.trim.high',
  INPUT_VOLTAGE_EXTENDED: 'input.voltage.extended',
  OUTLET_1_DESC: 'outlet.1.desc',
  OUTLET_1_UD: 'outlet.1.id',
  OUTLET_1_STATUS: 'outlet.1.status',
  OUTLET_1_SWITCHABLE: 'outlet.1.switchable',
  OUTLET_DESC: 'outlet.desc',
  OUTLET_ID: 'outlet.id',
  OUTLET_SWITCHABLE: 'outlet.switchable',
  OUTPUT_FREQUENCY_NOMINAL: 'output.frequency.nominal',
  OUTPUT_VOLTAGE: 'output.voltage',
  OUTPUT_VOLTAGE_NOMINAL: 'output.voltage.nominal',
  UPS_BEEPER_STATUS: 'ups.beeper.status',
  UPS_DELAY_SHUTDOWN: 'ups.delay.shutdown',
  UPS_EDLAY_START: 'ups.delay.start',
  UPS_FIRMWARE: 'ups.firmware',
  UPS_LOAD: 'ups.load',
  UPS_MFR: 'ups.mfr',
  UPS_MODEL: 'ups.model',
  UPS_POWER_NOMINAL: 'ups.power.nominal',
  UPS_PRODUCT_ID: 'ups.productid',
  UPS_SERIAL: 'ups.serial',
  UPS_STATUS: 'ups.status',
  UPS_TIMER_SHUTDOWN: 'ups.timer.shutdown',
  UPS_TIMER_START: 'ups.timer.start',
  UPS_VENDOR_ID: 'ups.vendorid',
};

const DEFAULT = {
  DEVICE: {
    should_poll: true,
    poll_frequency: DEVICE_POLL_FREQUENCIES.EVERY_MINUTES,
    features: [
      {
        name: PARAM_NAMES.UPS_STATUS,
        external_id: `ups:0:${PARAM_NAMES.UPS_STATUS}`,
        selector: slugify(`ups:0:${PARAM_NAMES.UPS_STATUS}`),
        category: DEVICE_FEATURE_CATEGORIES.TEXT,
        type: DEVICE_FEATURE_TYPES.TEXT.TEXT,
        read_only: true,
        keep_history: true,
        has_feedback: false,
        min: 0,
        max: 5,
      },
      {
        name: PARAM_NAMES.BATTERY_CHARGE,
        external_id: `ups:0:${PARAM_NAMES.BATTERY_CHARGE}`,
        selector: slugify(`ups:0:${PARAM_NAMES.BATTERY_CHARGE}`),
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
  UPS_TYPES,
  PARAM_NAMES,
  CONFIGURATION,
  DEFAULT,
};
