import { Component } from 'preact';
import { connect } from 'unistore/preact';
import Select from 'react-select';
import { Text, Localizer } from 'preact-i18n';
import update from 'immutability-helper';
import { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } from '../../../../../../server/utils/constants';

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
      this.refreshSelectedOptions(this.props);
    } catch (e) {
      console.error(e);
    }
  };
  handleHouseChange = selectedOption => {
    const newValue = {};
    if (selectedOption && selectedOption.value) {
      newValue[selectedOption.value] = [];
    }
    this.setState(prevState => {
      const newDevicesState = update(prevState.devices, {
        $push: [
          {
            house: selectedOption.value,
            device_features: []
          }
        ]
      });

      const newState = update(prevState, {
        devices: {
          $set: newDevicesState
        }
      });
      return newState;
    });
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
      const newState = update(prevState.devices, {
        [this.props.houseIndex]: {
          device_features: {
            $set: newValue
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
  refreshSelectedOptions = nextProps => {
    let selectedHouse = '';
    let selectedDevices = [];
    if (nextProps.house && this.state.house) {
      const houseOption = this.state.house.find(option => option.value === nextProps.house);
      if (houseOption) {
        selectedHouse = houseOption;
      }
      this.props.houseIndex = 0;
    }
    if (nextProps.device_features && this.state.devices) {
      const devices = [];
      nextProps.device_features.forEach(deviceFeature => {
        const featureOption = this.state.devices.find(option => option.value === deviceFeature);
        if (featureOption) {
          devices.push(featureOption);
        }
      });
      selectedDevices = devices;
    }
    this.setState({ selectedHouse, selectedDevices });
  };
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      devices: [],
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
  componentWillReceiveProps(nextProps) {
    this.refreshSelectedOptions(nextProps);
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
      </div>
    );
  }
}

export default connect('httpClient', {})(PresenceSettings);
