import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import UpsPage from '../UpsPage';
import UpsDevicesTab from './DevicesTab';

class UpsNodePage extends Component {
  async componentWillMount() {
    await this.props.getIntegrationByName('ups');
    this.props.getHouses();
    this.props.getUpsDevices();
  }

  render(props, {}) {
    return (
      <UpsPage>
        <UpsDevicesTab {...props} />
      </UpsPage>
    );
  }
}

export default connect(
  [
    'session',
    'user',
    'upsDevices',
    'houses',
    'currentIntegration',
    'getUpsDevicesStatus',
    'upsDeviceSearch',
    'getUpsDeviceOrderDir'
  ],
  actions
)(UpsNodePage);
