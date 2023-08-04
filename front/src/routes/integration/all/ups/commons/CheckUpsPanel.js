import { Component } from 'preact';
import { Link } from 'preact-router/match';
import { connect } from 'unistore/preact';
import actions from './actions';
import { Text } from 'preact-i18n';

class CheckUpsPanel extends Component {
  componentWillMount() {
    this.props.checkStatus();
  }

  render(props, {}) {
    let messageKey;
    if (!props.configured) {
      messageKey = 'integration.ups.status.notConfigured';
    } else if (!props.connected) {
      messageKey = 'integration.ups.status.notConnected';
    } else {
      return null;
    }

    return (
      <div class="alert alert-warning">
        <Text id={messageKey} />
        <Link href="/dashboard/integration/device/ups/settings">
          <Text id="integration.ups.status.settingsPageLink" />
        </Link>
      </div>
    );
  }
}

export default connect(
  'user,session,connected,configured',
  actions
)(CheckUpsPanel);
