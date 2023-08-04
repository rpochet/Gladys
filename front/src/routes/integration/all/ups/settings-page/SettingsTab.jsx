import { Component } from 'preact';
import { Text, MarkupText } from 'preact-i18n';
import cx from 'classnames';
import { RequestStatus } from '../../../../../utils/consts';

class SettingsTab extends Component {

  render(props) {
    let alertMessage = null;

    const { connectMqttStatus, mqttConnected } = props;
    switch (connectMqttStatus) {
      case RequestStatus.Error:
        // Error while updating settings
        alertMessage = (
          <p class="alert alert-danger">
            <Text id="integration.ups.settings.error" />
          </p>
        );
        break;
      case RequestStatus.Success:
        // Updating settings with success = connecting...
        alertMessage = (
          <p class="alert alert-info">
            <Text id="integration.ups.settings.connecting" />
          </p>
        );
        break;
      default:
    }

    return (
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            <Text id="integration.ups.settings.title" />
          </h2>
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
                <MarkupText id="integration.ups.settings.mqttDescription" />
              </p>
              {alertMessage}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsTab;
