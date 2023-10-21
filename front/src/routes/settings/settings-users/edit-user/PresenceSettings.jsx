import { Component } from 'preact';
import { connect } from 'unistore/preact';
import Select from 'react-select';
import get from 'get-value';
import { Text, Localizer } from 'preact-i18n';
import update from 'immutability-helper';
import { DEVICE_FEATURE_CATEGORIES } from '../../../../../../server/utils/constants';
import { RequestStatus } from '../../../../utils/consts';

class PresenceSettings extends Component {
  getOptions = async () => {
    try {
      const [houses, presenceDevices] = await Promise.all([
        this.props.httpClient.get('/api/v1/house'),
        this.props.httpClient.get('/api/v1/device', {
          device_feature_category: DEVICE_FEATURE_CATEGORIES.PRESENCE_SENSOR
        })
      ]);
      const houseOptions = houses.map(house => ({
        label: house.name,
        value: house.selector
      }));
      const devicesOptions = [];
      presenceDevices.forEach(device => {
        const feature = device.features.find(f => f.category === DEVICE_FEATURE_CATEGORIES.PRESENCE_SENSOR);
        if (feature) {
          devicesOptions.push({
            label: device.name,
            value: feature.selector
          });
        }
      });
      await this.setState({ houseOptions, devicesOptions });
    } catch (e) {
      console.error(e);
    }
  };
  handleHouseChange = selectedOption => {
    if (selectedOption && selectedOption.value) {
      const houseOption = this.state.houseOptions.find(option => option.value === selectedOption.value);
      this.setState(prevState => {
        const newState = update(prevState, {
          devices: {
            $merge: {
              house: selectedOption.value,
              device_features: []
            }
          },
          selectedHouse: {
            $set: houseOption
          }
        });
        return newState;
      });
    }
  };
  handleDeviceChange = selectedOptions => {
    let newValue;
    if (selectedOptions && selectedOptions.length) {
      const deviceFeatures = selectedOptions.map(option => option.value);
      newValue = deviceFeatures;
    } else {
      newValue = [];
    }
    this.setState(prevState => {
      const newState = update(prevState, {
        devices: {
          $merge: {
            house: prevState.selectedHouse.value,
            device_features: newValue
          }
        }
      });
      return newState;
    });
  };
  handleChangeDuration = e => {
    let newValue = Number.isInteger(parseInt(e.target.value, 10)) ? parseInt(e.target.value, 10) : 0;
    this.setState(prevState => {
      const newState = update(prevState, {
        minutes: {
          $set: newValue
        }
      });
      return newState;
    });
  };
  updateUser = async () => {
    const data = update(this.props.newUser, {
      presence_device_features: {
        $merge: {
          devices: this.state.devices,
          minutes: this.state.minutes
        }
      }
    });
    this.context.store.setState({
      UserPatchStatus: RequestStatus.Getting
    });
    try {
      await this.props.httpClient.patch(`/api/v1/user/${data.selector}`, data);
      this.context.store.setState({
        UserPatchStatus: RequestStatus.Success
      });
    } catch (e) {
      console.error(e);
      const status = get(e, 'response.status');
      if (status === 409) {
        this.context.store.setState({
          UserPatchError: e.response.data,
          UserPatchStatus: RequestStatus.ConflictError
        });
      } else {
        this.context.store.setState({
          UserPatchStatus: RequestStatus.Error
        });
      }
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      devices: {},
      minutes: null
    };
  }
  componentDidMount() {
    if (!this.props.minutes) {
      this.handleChangeDuration({
        target: {
          value: 10
        }
      });
    }
    this.getOptions();
  }
  render(props, { houseOptions, selectedHouse, devicesOptions, selectedDevices }) {
    return (
      <div>
        <p>
          <small>
            <Text id="editScene.actionsCard.checkUserPresence.description" />
          </small>
        </p>
        <div class="form-group">
          <label class="form-label">
            <Text id="editScene.actionsCard.checkUserPresence.houseLabel" />
            <span class="form-required">
              <Text id="global.requiredField" />
            </span>
          </label>
          <Select options={houseOptions} value={selectedHouse} onChange={this.handleHouseChange} />
        </div>
        <div class="form-group">
          <label class="form-label">
            <Text id="editScene.actionsCard.checkUserPresence.deviceLabel" />
            <span class="form-required">
              <Text id="global.requiredField" />
            </span>
          </label>
          <Select options={devicesOptions} value={selectedDevices} isMulti onChange={this.handleDeviceChange} />
        </div>
        <div class="form-group">
          <label class="form-label">
            <Text id="editScene.actionsCard.checkUserPresence.minutesLabel" />
            <span class="form-required">
              <Text id="global.requiredField" />
            </span>
          </label>
          <div class="input-group mb-3">
            <Localizer>
              <input
                type="text"
                class="form-control"
                value={props.minutes}
                onChange={this.handleChangeDuration}
                placeholder={<Text id="editScene.actionsCard.checkUserPresence.minutesPlaceholder" />}
              />
            </Localizer>
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <Text id="editScene.actionsCard.checkUserPresence.minutes" />
              </span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <button onClick={this.updateUser} class="btn btn-success">
            <Text id="profile.saveButton" />
          </button>
        </div>
      </div>
    );
  }
}

export default connect('httpClient', {})(PresenceSettings);
