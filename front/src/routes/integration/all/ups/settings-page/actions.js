import createActionsIntegration from '../../../../../actions/integration';
import { RequestStatus } from '../../../../../utils/consts';

const createActions = store => {
  const integrationActions = createActionsIntegration(store);
  const actions = {
    async getUsbPorts(state) {
      store.setState({
        zwaveGetUsbPortStatus: RequestStatus.Getting
      });
      try {
        const usbPorts = await state.httpClient.get('/api/v1/service/usb/port');
        store.setState({
          usbPorts,
          zwaveGetUsbPortStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          zwaveGetUsbPortStatus: RequestStatus.Error
        });
      }
    },
    async loadStatus(state) {
      let upsStatus = {
        connected: false
      };
      try {
        upsStatus = await state.httpClient.get('/api/v1/service/ups/status');
      } finally {
        store.setState({
          upsConnected: upsStatus.connected
        });
      }
    },
    async loadProps(state) {
      let configuration = {};
      try {
        configuration = await state.httpClient.get('/api/v1/service/ups/config');
      } finally {
        store.setState({
          upsUrl: configuration.upsUrl,
          upsUsername: configuration.upsUsername,
          upsPassword: configuration.upsPassword,
          passwordChanges: false,
          connected: false
        });
      }
    },
    updateConfiguration(state, config) {
      store.setState(config);
    },
    async saveConfiguration(state) {
      event.preventDefault();
      store.setState({
        connectMqttStatus: RequestStatus.Getting,
        upsConnected: false,
        upsConnectionError: undefined
      });
      try {
        const { upsUrl, upsUsername, upsPassword } = state;
        await state.httpClient.post(`/api/v1/service/ups/connect`, {
          upsUrl,
          upsUsername,
          upsPassword,
        });

        store.setState({
          connectMqttStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          connectMqttStatus: RequestStatus.Error,
          passwordChanges: false
        });
      }
    },
    displayConnectedMessage() {
      // display 3 seconds a message "MQTT connected"
      store.setState({
        upsConnected: true,
        connectMqttStatus: undefined,
        upsConnectionError: undefined
      });
    },
    displayMqttError(state, error) {
      store.setState({
        upsConnected: false,
        connectMqttStatus: undefined,
        upsConnectionError: error
      });
    }
  };
  return Object.assign({}, actions, integrationActions);
};

export default createActions;
