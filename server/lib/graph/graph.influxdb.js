// const client = require('prom-client');

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const token = 'XoyURoniQTe3KYI8wQMXJoLoiI7pgjW2izmQHH1E2-k0a-p1mH9aiNWokgpC2feHwEyLmynsmHSl9zKEzmoCgg==';
const url = 'http://192.168.1.4:8086';
const org = `rpochet`;
const bucket = `gladys`;

const client = new InfluxDB({ url, token });
const writeClient = client.getWriteApi(org, bucket, 'ns');

setTimeout(() => {
  writeClient.flush();
}, 60000);

/**
 * @description Save historical device feature state in DB.
 * @param {object} deviceFeature - A DeviceFeature object.
 * @param {number} newValue - The new value of the deviceFeature to save.
 * @param {string} newValueCreatedAt - The date of the new state.
 * @example
 * saveHistoricalState({
 *   id: 'fc235c88-b10d-4706-8b59-fef92a7119b2',
 *   selector: 'my-light'
 * }, 12, '2011-10-05T14:48:00.000Z');
 */
async function saveHistoricalState(deviceFeature, newValue, newValueCreatedAt) {
  const point = new Point(deviceFeature.selector).timestamp(newValueCreatedAt).intField('value', newValue);
  writeClient.writePoint(point);
}

/**
 * @description Save new device feature state in DB.
 * @param {object} deviceFeature - A DeviceFeature object.
 * @param {number} newValue - The new value of the deviceFeature to save.
 * @example
 * saveState({
 *   id: 'fc235c88-b10d-4706-8b59-fef92a7119b2',
 *   selector: 'my-light'
 * }, 12);
 */
async function saveState(deviceFeature, newValue) {
  const point = new Point(deviceFeature.selector).intField('value', newValue);
  writeClient.writePoint(point);
}

module.exports = {
  saveHistoricalState,
  saveState,
};
