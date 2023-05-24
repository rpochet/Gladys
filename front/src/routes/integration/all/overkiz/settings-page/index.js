import { Component } from 'preact';
import { connect } from 'unistore/preact';
import OverkizPage from '../OverkizPage';
import SettingsTab from './SettingsTab';
import { SUPPORTED_SERVERS } from '../../../../../../../server/services/overkiz/lib/utils/overkiz.constants';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../server/utils/constants';

class OverkizSettingsTab extends Component {
  componentWillMount() {
    this.props.getIntegrationByName('overkiz');
    this.props.getConfiguration();
    this.props.overkizTypes = SUPPORTED_SERVERS;
    this.props.session.dispatcher.addListener(
      WEBSOCKET_MESSAGE_TYPES.OVERKIZ.CONNECTED,
      this.props.displayConnectedMessage
    );
    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.OVERKIZ.ERROR, this.props.displayOverkizError);
  }

  componentWillUnmount() {
    this.props.session.dispatcher.removeListener(
      WEBSOCKET_MESSAGE_TYPES.OVERKIZ.CONNECTED,
      this.props.displayConnectedMessage
    );
    this.props.session.dispatcher.removeListener(WEBSOCKET_MESSAGE_TYPES.OVERKIZ.ERROR, this.props.displayOverkizError);
  }

  render(props, {}) {
    return (
      <OverkizPage user="{props.user}">
        <SettingsTab {...props} />
      </OverkizPage>
    );
  }
}

export default connect(
  'user,session,overkizType,overkizUsername,overkizPassword,overkizGetConfigurationStatus,saveConfigurationStatus',
  {}
)(OverkizSettingsTab);