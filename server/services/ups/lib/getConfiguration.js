const { CONFIGURATION } = require('./constants');
const containerDescriptor = require('../docker/nut-container.json');

/**
 * @description Get UPS configuration.
 * @returns {Promise} Current UPS configuration.
 * @example getConfiguration();
 */
async function getConfiguration() {
  const nutUrl = await this.gladys.variable.getValue(CONFIGURATION.URL, this.serviceId);

  let brokerContainerAvailable = false;
  const dockerBased = await this.gladys.system.isDocker();

  let useEmbeddedBroker = false;
  let networkModeValid = false;

  // Look for broker docker image
  if (dockerBased) {
    const gladysNetworkMode = await this.gladys.system.getNetworkMode();
    networkModeValid = gladysNetworkMode === 'host';

    const useEmbeddedBrokerVariable = await this.gladys.variable.getValue(
      CONFIGURATION.NUT_EMBEDDED_BROKER,
      this.serviceId,
    );
    // Boolean stored as integer, we need to check it
    useEmbeddedBroker = networkModeValid && useEmbeddedBrokerVariable !== '0';

    if (useEmbeddedBroker) {
      const dockerImages = await this.gladys.system.getContainers({
        all: true,
        filters: {
          name: [containerDescriptor.name],
        },
      });
      brokerContainerAvailable = dockerImages.length > 0;
    }
  }

  return {
    nutUrl,
    useEmbeddedBroker,
    dockerBased,
    brokerContainerAvailable,
    networkModeValid,
  };
}

module.exports = {
  getConfiguration,
};
