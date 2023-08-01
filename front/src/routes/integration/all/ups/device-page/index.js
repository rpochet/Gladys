import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../../common/device-page/actions';
import UpsPage from '../UpsPage';
import DevicesTab from '../../common/device-page/DevicesTab';

class UpsDevicePage extends Component {
  async componentWillMount() {
    await this.props.getIntegrationByName('ups');
    this.props.getHouses();
    this.props.getDevices();
  }

  render(props, {}) {
    return (
      <UpsPage>
        <DevicesTab {...props} />
      </UpsPage>
    );
  }
}

export default connect(
  ['session','user','devices','houses','currentIntegration','getDevicesStatus','deviceSearch','getDeviceOrderDir'],
  actions
)(UpsDevicePage);
