import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import UpsPage from '../UpsPage';
import SetupTab from './SetupTab';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../server/utils/constants';

class UpsNodePage extends Component {
  componentWillMount() {
    this.props.getIntegrationByName('ups');
    this.props.loadProps();
    this.props.loadStatus();
    this.props.session.dispatcher.addListener(
      WEBSOCKET_MESSAGE_TYPES.UPS.CONNECTED,
      this.props.displayConnectedMessage
    );
    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.UPS.ERROR, this.props.displayMqttError);
  }

  componentWillUnmount() {
    this.props.session.dispatcher.removeListener(
      WEBSOCKET_MESSAGE_TYPES.UPS.CONNECTED,
      this.props.displayConnectedMessage
    );
    this.props.session.dispatcher.removeListener(WEBSOCKET_MESSAGE_TYPES.UPS.ERROR, this.props.displayMqttError);
  }

  render(props, {}) {
    return (
      <UpsPage>
        <SetupTab {...props} />
      </UpsPage>
    );
  }
}

export default connect(
  'user,session,httpClient,connectMqttStatus,upsConnected,upsConnectionError',
  actions
)(UpsNodePage);
