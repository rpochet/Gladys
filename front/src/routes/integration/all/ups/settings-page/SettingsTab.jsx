import { Component } from 'preact';
import { Text, MarkupText } from 'preact-i18n';
import cx from 'classnames';
import { RequestStatus } from '../../../../../utils/consts';
import SettingsForm from './SettingsForm';
import SettingsBrokerContainer from './SettingsBrokerContainer';

class SettingsTab extends Component {
  updateDockerUsage = () => {
    const useEmbeddedBroker = !this.props.useEmbeddedBroker;
    const config = { useEmbeddedBroker };
    if (useEmbeddedBroker) {
      config.nutUrl = 'localhost:3493';
    }
    this.props.updateConfiguration(config);
  };

  render(props) {
    let alertMessage = null;

    const { connectUpsStatus, upsConnected, upsConnectionError } = props;
    switch (connectUpsStatus) {
      case RequestStatus.Error:
        // Error while updating setup
        alertMessage = (
          <p class="alert alert-danger">
            <Text id="integration.ups.settings.error" />
          </p>
        );
        break;
      case RequestStatus.Getting:
        // Updating setup with success = connecting...
        alertMessage = (
          <p class="alert alert-info">
            <Text id="integration.ups.settings.connecting" />
          </p>
        );
        break;
      case RequestStatus.Success:
        // Updating setup with success = connected...
        alertMessage = (
          <p class="alert alert-info">
            <Text id="integration.ups.settings.connected" />
          </p>
        );
        break;
      default:
        if (upsConnectionError === 'DISCONNECTED') {
          alertMessage = (
            <p class="alert alert-info">
              <Text id="integration.ups.settings.disconnected" />
            </p>
          );
        } else if (upsConnectionError || upsConnected === false) {
          alertMessage = (
            <p class="alert alert-danger">
              <Text id="integration.ups.settings.connectionError" />
            </p>
          );
        } else if (upsConnected) {
          // Well connected
          alertMessage = (
            <p class="alert alert-success">
              <Text id="integration.ups.settings.connected" />
            </p>
          );
        }
    }

    return (
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <Text id="integration.ups.settings.title" />
          </h3>
        </div>
        <div class="card-body">
          <div
            class={cx('dimmer', {
              active: props.connectUpsStatus === RequestStatus.Getting
            })}
          >
            <div class="loader" />
            <div class="dimmer-content">
              <p>
                <MarkupText id="integration.ups.settings.upsDescription" />
              </p>
              {alertMessage}

              <div class="form-group">
                <label for="embeddedBroker" class="form-label">
                  <Text id={`integration.ups.settings.embeddedBrokerLabel`} />
                </label>
                <label class="custom-swith">
                  <input
                    type="checkbox"
                    id="useEmbeddedBroker"
                    name="useEmbeddedBroker"
                    class="custom-switch-input"
                    checked={props.useEmbeddedBroker}
                    onClick={this.updateDockerUsage}
                    disabled={!props.dockerBased || !props.networkModeValid}
                  />
                  <span class="custom-switch-indicator" />
                  <span class="custom-switch-description">
                    {!props.dockerBased && <Text id="integration.ups.settings.nonDockerEnv" />}
                    {props.dockerBased && !props.networkModeValid && (
                      <Text id="integration.ups.settings.invalidDockerNetwork" />
                    )}
                    {props.dockerBased && props.networkModeValid && (
                      <Text id="integration.ups.settings.installBrokerContainer" />
                    )}
                  </span>
                </label>
              </div>

              {props.useEmbeddedBroker && !props.brokerContainerAvailable && <SettingsBrokerContainer {...props} />}

              {(!props.useEmbeddedBroker || props.brokerContainerAvailable) && <SettingsForm {...props} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsTab;
