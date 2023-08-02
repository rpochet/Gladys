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
    async getDevices(state) {
      store.setState({
        getDevicesStatus: RequestStatus.Getting
      });
      try {
        const options = {
          order_dir: state.getDeviceOrderDir || 'asc'
        };
        if (state.deviceSearch && state.deviceSearch.length) {
          options.search = state.deviceSearch;
        }
        const devices = await state.httpClient.get(`/api/v1/service/${state.currentIntegration.name}/device`, options);
        store.setState({
          devices,
          getDevicesStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          devices: [],
          getDevicesStatus: RequestStatus.Error
        });
      }
    },
    async saveDevice(state, device, index) {
      const savedDevice = await state.httpClient.post('/api/v1/device', device);
      const newState = update(state, {
        devices: {
          $splice: [[index, 1, savedDevice]]
        }
      });
      store.setState(newState);
    },
    updateDeviceProperty(state, index, property, value) {
      const newState = update(state, {
        devices: {
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
        devices: {
          $splice: [[index, 1]]
        }
      });
      store.setState(newState);
    },
    async search(state, e) {
      store.setState({
        deviceSearch: e.target.value
      });
      await actions.getDevices(store.getState());
    },
    async changeOrderDir(state, e) {
      store.setState({
        getDeviceOrderDir: e.target.value
      });
      await actions.getDevices(store.getState());
    },
    addDeviceFeature(state, index, category, type) {
      const uniqueId = uuid.v4();
      const devices = update(state.devices, {
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
        devices
      });
    },
    updateDeviceFeatureProperty(state, deviceIndex, featureIndex, property, value) {
      const devices = update(state.devices, {
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
        devices
      });
    },
    deleteDeviceFeature(state, deviceIndex, featureIndex) {
      const devices = update(state.devices, {
        [deviceIndex]: {
          features: {
            $splice: [[featureIndex, 1]]
          }
        }
      });

      store.setState({
        devices
      });
    }
  };
  actions.debouncedSearch = debounce(actions.search, 200);
  return Object.assign({}, houseActions, integrationActions, actions);
}

export default createActions;
