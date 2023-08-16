const UPS_TYPES = {
  apc: 'APC',
};

const CONFIGURATION = {
  URL: 'UPS_NUT_URL',
};

const STATUS = {
  ONLINE: 'OL',
  ON_BATTERY: 'OB',
  LOW_BATTERY: 'LB',
};

const PARAM_NAMES = {
  BATTERY_CHARGE: 'battery.charge',
  BATTERY_CHARGE_LOW: 'battery.charge.low',
  BATTERY_CHARGE_WARNING: 'battery.charge.warning',
  BATTERY_DATE: 'battery.date',
  BATTERY_MFR_DATE: 'battery.mft.data',
  BATTERY_RUNTIME: 'battery.runtime',
  BATTERY_RUNTIME_LOW: 'battery.runtime.low',
  BATTERY_TYPE: 'battery.type',
  BATTERY_VOLTAGE: 'battery.voltage',
  BATTERY_VOLTAGE_NOMINAL: 'battery.voltage.nominal',
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
  UPS_URL: 'localhost:9443',
  NUT_HOST: '192.168.1.4',
  NUT_PORT: 9443,
};

module.exports = {
  UPS_TYPES,
  PARAM_NAMES,
  STATUS,
  CONFIGURATION,
  DEFAULT,
};
