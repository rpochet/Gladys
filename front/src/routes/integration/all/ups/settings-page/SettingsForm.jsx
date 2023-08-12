import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';

class SettingsForm extends Component {

  updateUrl = e => {
    this.props.updateConfiguration({ nutUrl: e.target.value });
  };

  render(props) {
    return (
      <form>
        <div class="form-group">
          <label for="nutUrl" class="form-label">
            <Text id={`integration.ups.settings.urlLabel`} />
          </label>
          <Localizer>
            <input
              id="nutUrl"
              name="nutUrl"
              placeholder={<Text id="integration.ups.settings.urlPlaceholder" />}
              value={props.nutUrl}
              class="form-control"
              onInput={this.updateUrl}
              disabled={props.useEmbeddedBroker}
            />
          </Localizer>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-success" onClick={props.saveConfiguration}>
            <Text id="integration.ups.settings.saveLabel" />
          </button>
        </div>
      </form>
    );
  }
}

export default SettingsForm;
