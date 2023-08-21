import { Component } from 'preact';
import { Text, MarkupText } from 'preact-i18n';
import { RequestStatus } from '../../../../../utils/consts';

class SetupBrokerContainer extends Component {
  installContainer = async () => {
    this.setState({ installing: RequestStatus.Getting });
    try {
      await this.props.httpClient.post('/api/v1/service/ups/config/docker');
      await this.props.getConfiguration();
      this.props.updateConfiguration({ useEmbeddedBroker: true });
      this.setState({ installing: RequestStatus.Success });
    } catch (e) {
      this.setState({ installing: RequestStatus.Error });
    }
  };

  render({}, { installing }) {
    return (
      <div>
        <div class="alert alert-info">
          <MarkupText id="integration.ups.settings.brokerDockerNotInstalled" />
        </div>
        {installing === RequestStatus.Error && (
          <div class="alert alert-danger">
            <MarkupText id="integration.ups.settings.installBrokerError" />
          </div>
        )}
        <div class="form-group">
          {installing !== RequestStatus.Getting && (
            <button type="button" class="btn btn-primary" onClick={this.installContainer}>
              <Text id="integration.ups.settings.installBrokerButton" />
            </button>
          )}
          {installing === RequestStatus.Getting && (
            <button type="button" class="btn btn-primary btn-loading" disabled>
              <Text id="integration.ups.settings.installingBrokerButton" />
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default SetupBrokerContainer;
