// const client = require('prom-client');

// Create a Registry to register the metrics
/* const register = new client.Registry();
client.collectDefaultMetrics({
  app: 'gladys',
  prefix: 'gladys_',
  timeout: 10000,
  register,
});

const registry = {}; */

/* 
const gateway = new client.Pushgateway('http://192.168.1.4:9091', [], register);
const pushRegistry = setTimeout(() => {
  gateway
    .push({ 
      jobName: 'gladys_' 
    })
    .then(({ resp, body }) => {
      console.log(`Body: ${body}`);
      console.log(`Response status: ${resp.statusCode}`);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
}, 10000); */

/**
 *
 * @description ContentType.
 * @returns {string} ContentType.
 * @example contentType()
 */
/* function contentType() {
  return register.contentType;
} */

/**
 *
 * @description Metrics.
 * @returns {object} Metrics.
 * @example metrics()
 */
/* function metrics() {
  return register.metrics();
} */

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
  /* let histogram = registry[deviceFeature.external_id];
  if (!histogram) {
    histogram = new client.Histogram({
      name: deviceFeature.external_id,
      help: deviceFeature.external_id,
      labelNames: ['value'],
    });
    registry[deviceFeature.external_id] = histogram;
  }
  histogram.labels('value').observe(newValue); */
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
  /* let histogram = registry[deviceFeature.external_id];
  if (!histogram) {
    histogram = new client.Histogram({
      name: deviceFeature.external_id,
      help: deviceFeature.external_id,
      labelNames: ['value'],
    });
    registry[deviceFeature.external_id] = histogram;
  }
  histogram.labels('value').observe(newValue); */
  // register.metrics().then(str => console.log(str));
}

module.exports = {
  // contentType,
  // metrics,
  saveHistoricalState,
  saveState,
};
