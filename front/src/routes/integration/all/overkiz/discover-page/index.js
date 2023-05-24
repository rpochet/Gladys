import { Component } from 'preact';
import { connect } from 'unistore/preact';
import OverkizPage from '../OverkizPage';
import DiscoverTab from './DiscoverTab';

class OverkizIntegration extends Component {
  async componentWillMount() {
    this.props.getDiscoveredOverkizDevices();
    this.props.getHouses();
    this.props.getIntegrationByName('overkiz');
  }

  render(props) {
    return (
      <OverkizPage user={props.user}>
        <DiscoverTab {...props} />
      </OverkizPage>
    );
  }
}

export default connect(
  'user,session,httpClient,housesWithRooms,discoveredDevices,loading,errorLoading',
  {}
)(OverkizIntegration);