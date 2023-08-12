import createActionsIntegration from '../../../../../actions/integration';
import { RequestStatus } from '../../../../../utils/consts';

const createActions = store => {
  const integrationActions = createActionsIntegration(store);
  const actions = {
    async loadStatus(state) {
      let upsStatus = {
        configured: false,
        connected: false
      };
      try {
        upsStatus = await state.httpClient.get('/api/v1/service/ups/status');
      } finally {
        store.setState(upsStatus);
      }
    },
    async loadProps(state) {
      let configuration = {};
      try {
        configuration = await state.httpClient.get('/api/v1/service/ups/config');
      } finally {
        store.setState({
          nutUrl: configuration.nutUrl,
          useEmbeddedBroker: configuration.useEmbeddedBroker,
          dockerBased: configuration.dockerBased,
          networkModeValid: configuration.networkModeValid,
          brokerContainerAvailable: configuration.brokerContainerAvailable,
        });
      }
    },
    updateConfiguration(state, config) {
      store.setState(config);
    },
    async saveConfiguration(state) {
      event.preventDefault();
      store.setState({
        connectUpsStatus: RequestStatus.Getting,
        upsConnected: false,
        upsConnectionError: undefined
      });
      try {
        const { nutUrl, useEmbeddedBroker } = state;
        await state.httpClient.post(`/api/v1/service/ups/config`, {
          nutUrl,
          useEmbeddedBroker
        });

        store.setState({
          connectUpsStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          connectUpsStatus: RequestStatus.Error,
        });
      }
    },
    displayConnectedMessage() {
      // display 3 seconds a message "UPS connected"
      store.setState({
        upsConnected: true,
        connectUpsStatus: undefined,
        upsConnectionError: undefined
      });
    },
    displayUpsError(state, error) {
      store.setState({
        upsConnected: false,
        connectUpsStatus: undefined,
        upsConnectionError: error
      });
    }
  };
  return Object.assign({}, actions, integrationActions);
};

export default createActions;
