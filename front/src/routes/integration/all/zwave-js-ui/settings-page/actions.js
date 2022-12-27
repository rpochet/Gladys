import createActionsIntegration from '../../../../../actions/integration';
import { RequestStatus } from '../../../../../utils/consts';

const createActions = store => {
  const integrationActions = createActionsIntegration(store);
  const actions = {
    async getUsbPorts(state) {
      store.setState({
        getZwaveUsbPortStatus: RequestStatus.Getting
      });
      try {
        const usbPorts = await state.httpClient.get('/api/v1/service/usb/port');
        store.setState({
          usbPorts,
          getZwaveUsbPortStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          getZwaveUsbPortStatus: RequestStatus.Error
        });
      }
    },
    async getConfiguration(state) {
      store.setState({
        getConfigurationStatus: RequestStatus.Getting
      });
      try {
        const configuration = await state.httpClient.get('/api/v1/service/zwave-js-ui/configuration');
        store.setState({
          getConfigurationStatus: RequestStatus.Success,
          ...configuration
        });
      } catch (e) {
        store.setState({
          getConfigurationStatus: RequestStatus.Error
        });
      }
    },
    async getStatus(state) {
      store.setState({
        getStatusStatus: RequestStatus.Getting
      });
      try {
        const zwaveStatus = await state.httpClient.get('/api/v1/service/zwave-js-ui/status');
        store.setState({
          getStatusStatus: RequestStatus.Success,
          ...zwaveStatus
        });
      } catch (e) {
        store.setState({
          getStatusStatus: RequestStatus.Error,
          zwaveConnectionInProgress: false
        });
      }
    },
    updateConfiguration(state, configuration) {
      store.setState(configuration);
    },
    async connect(state) {
      await actions.disconnect(state);
      await actions.saveConfiguration(state);
      store.setState({
        zwaveConnectStatus: RequestStatus.Getting
      });
      try {
        await state.httpClient.post('/api/v1/service/zwave-js-ui/connect');
        await actions.getStatus(store.getState());
        store.setState({
          zwaveConnectStatus: RequestStatus.Success,
          zwaveConnectionInProgress: true
        });
      } catch (e) {
        store.setState({
          zwaveConnectStatus: RequestStatus.Error
        });
      }
    },
    async disconnect(state) {
      store.setState({
        zwaveDisconnectStatus: RequestStatus.Getting
      });
      try {
        await state.httpClient.post('/api/v1/service/zwave-js-ui/disconnect');
        await actions.getStatus(store.getState());
        store.setState({
          zwaveDisconnectStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          zwaveDisconnectStatus: RequestStatus.Error
        });
      }
    },
    async saveConfiguration(state) {
      event.preventDefault();
      store.setState({
        saveConfigurationStatus: RequestStatus.Getting
      });

      const {
        externalZwaveJSUI,
        driverPath,
        mqttUrl,
        mqttUsername,
        mqttPassword,
        s2UnauthenticatedKey,
        s2AuthenticatedKey,
        s2AccessControlKey,
        s0LegacyKey
      } = state;
      try {
        await state.httpClient.post(`/api/v1/service/zwave-js-ui/configuration`, {
          externalZwaveJSUI,
          driverPath,
          mqttUrl,
          mqttUsername,
          mqttPassword,
          s2UnauthenticatedKey,
          s2AuthenticatedKey,
          s2AccessControlKey,
          s0LegacyKey
        });

        store.setState({
          saveConfigurationStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          saveConfigurationStatus: RequestStatus.Error
        });
      }
    }
  };
  return Object.assign({}, actions, integrationActions);
};

export default createActions;