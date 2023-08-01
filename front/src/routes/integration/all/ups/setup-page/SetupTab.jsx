import { Component } from 'preact';
import { Text, MarkupText } from 'preact-i18n';
import cx from 'classnames';
import { RequestStatus } from '../../../../../utils/consts';

class SetupTab extends Component {
  render(props) {
    let alertMessage = null;

    const { connectMqttStatus, mqttConnected } = props;
    switch (connectMqttStatus) {
      case RequestStatus.Error:
        // Error while updating setup
        alertMessage = (
          <p class="alert alert-danger">
            <Text id="integration.ups.setup.error" />
          </p>
        );
        break;
      case RequestStatus.Success:
        // Updating setup with success = connecting...
        alertMessage = (
          <p class="alert alert-info">
            <Text id="integration.ups.setup.connecting" />
          </p>
        );
        break;
      default:
    }

    return (
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <Text id="integration.ups.setup.title" />
          </h3>
        </div>
        <div class="card-body">
          <div
            class={cx('dimmer', {
              active: props.connectMqttStatus === RequestStatus.Getting
            })}
          >
            <div class="loader" />
            <div class="dimmer-content">
              <p>
                <MarkupText id="integration.ups.setup.mqttDescription" />
              </p>
              {alertMessage}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SetupTab;
