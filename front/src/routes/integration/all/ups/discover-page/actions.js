import { RequestStatus } from '../../../../../utils/consts';
import update from 'immutability-helper';
import uuid from 'uuid';
import createActionsHouse from '../../../../../actions/house';
import createActionsIntegration from '../../../../../actions/integration';
import debounce from 'debounce';

function createActions(store) {
  const houseActions = createActionsHouse(store);
  const integrationActions = createActionsIntegration(store);
  const actions = {
    async getUpsDevices(state) {
      store.setState({
        getUpsDevicesStatus: RequestStatus.Getting
      });
      try {
        const options = {
          order_dir: state.getUpsDeviceOrderDir || 'asc'
        };
        if (state.upsDeviceSearch && state.upsDeviceSearch.length) {
          options.search = state.upsDeviceSearch;
        }
        const upsDevices = await state.httpClient.get('/api/v1/service/ups/device', options);
        store.setState({
          upsDevices,
          getUpsDevicesStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          upsDevices: [],
          getUpsDevicesStatus: RequestStatus.Error
        });
      }
    },
    async scanNetwork(state) {
      store.setState({
        upsScanNetworkStatus: RequestStatus.Getting
      });
      try {
        await state.httpClient.post('/api/v1/service/ups/scan');
        store.setState({
          upsScanNetworkStatus: RequestStatus.Success
        });
        actions.getStatus(store.getState());
      } catch (e) {
        store.setState({
          upsScanNetworkStatus: RequestStatus.Error
        });
      }
    },
    async saveDevice(state, device, index) {
      const savedDevice = await state.httpClient.post('/api/v1/device', device);
      const newState = update(state, {
        upsDevices: {
          $splice: [[index, 1, savedDevice]]
        }
      });
      store.setState(newState);
    },
    updateDeviceProperty(state, index, property, value) {
      const newState = update(state, {
        upsDevices: {
          [index]: {
            [property]: {
              $set: value
            }
          }
        }
      });
      store.setState(newState);
    },
    async deleteDevice(state, device, index) {
      await state.httpClient.delete(`/api/v1/device/${device.selector}`);
      const newState = update(state, {
        upsDevices: {
          $splice: [[index, 1]]
        }
      });
      store.setState(newState);
    },
    async search(state, e) {
      store.setState({
        upsDeviceSearch: e.target.value
      });
      await actions.getUpsDevices(store.getState());
    },
    async changeOrderDir(state, e) {
      store.setState({
        getUpsDeviceOrderDir: e.target.value
      });
      await actions.getUpsDevices(store.getState());
    },
    addDeviceFeature(state, index, category, type) {
      const uniqueId = uuid.v4();
      const upsDevices = update(state.upsDevices, {
        [index]: {
          features: {
            $push: [
              {
                id: uniqueId,
                category,
                type,
                read_only: true,
                has_feedback: false
              }
            ]
          }
        }
      });

      store.setState({
        upsDevices
      });
    },
    updateFeatureProperty(state, deviceIndex, featureIndex, property, value) {
      const upsDevices = update(state.upsDevices, {
        [deviceIndex]: {
          features: {
            [featureIndex]: {
              [property]: {
                $set: value
              }
            }
          }
        }
      });

      store.setState({
        upsDevices
      });
    },
    deleteFeature(state, deviceIndex, featureIndex) {
      const upsDevices = update(state.upsDevices, {
        [deviceIndex]: {
          features: {
            $splice: [[featureIndex, 1]]
          }
        }
      });

      store.setState({
        upsDevices
      });
    }
  };
  actions.debouncedSearch = debounce(actions.search, 200);
  return Object.assign({}, houseActions, integrationActions, actions);
}

export default createActions;
