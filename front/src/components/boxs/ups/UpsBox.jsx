import { Component } from 'preact';
import { connect } from 'unistore/preact';
import { Text } from 'preact-i18n';
import style from './style.css';
import cx from 'classnames';

import { PARAM_NAMES, DEFAULT } from '../../../../../server/services/ups/lib/constants';
import { WEBSOCKET_MESSAGE_TYPES, DASHBOARD_BOX_TYPE } from '../../../../../server/utils/constants';
import actions from '../../../actions/dashboard/boxes/ups';
import { RequestStatus, DASHBOARD_BOX_DATA_KEY } from '../../../utils/consts';
import get from 'get-value';
import RelativeTime from '../../device/RelativeTime';

class UpsBox extends Component {
  render({ user, ...props }) {
    const { upsObject } = props;
    const name = upsObject.name;
    const status = upsObject.features.find(feature => feature.name === PARAM_NAMES.UPS_STATUS).last_value;

    const batteryFeature = upsObject.features.find(feature => feature.name === PARAM_NAMES.BATTERY_CHARGE);
    const { last_value: battery, last_value_changed: lastValueChanged } = batteryFeature;

    const batteryVoltage = upsObject.features.find(feature => feature.name === PARAM_NAMES.BATTERY_VOLTAGE).last_value;
    const batteryVoltageNominal = upsObject.features.find(
      feature => feature.name === PARAM_NAMES.BATTERY_VOLTAGE_NOMINAL
    ).last_value;

    const batteryLevelClassname = `level-${Math.round(battery / 10) * 10}`;
    const statusHigh = Math.round(status / (10**DEFAULT.MAX_STATUS_LENGTH));

    return (
      <div class="card">
        {props.boxStatus === RequestStatus.Error && (
          <div>
            <h4 class="card-header">
              <Text id="dashboard.boxTitle.ups" />
            </h4>
            <div class="card-body">
              <p class="alert alert-danger">
                <i class="fe fe-bell" />
                <span class="pl-2">
                  <Text id="dashboard.boxes.ups.unknownError" />
                </span>
              </p>
            </div>
          </div>
        )}
        {props.boxStatus === RequestStatus.Getting && (
          <div>
            <div class="card-body">
              <div class="dimmer active">
                <div class="loader" />
                <div class="dimmer-content" />
              </div>
            </div>
          </div>
        )}
        {props.upsObject && (
          <>
            <div class="card-header">
              <h3 class="card-title">{name}</h3>
            </div>
            <div
              class={cx('dimmer', {
                active: props.boxStatus === RequestStatus.Getting
              })}
            >
              <div class="loader py-3" />
              <div class="dimmer-content">
                <div class="table-responsive">
                  <table class="table card-table table-vcenter">
                    <tbody>
                      <tr>
                        <td>
                          <i
                            class={cx('fe', {
                              'fe-zap': statusHigh <= 1,
                              'fe-zap-off': statusHigh > 1
                            })}
                          />
                          <i
                            class={cx('fe', 'fe-chevrons-right', {
                              [style['status-ok']]: statusHigh <= 1,
                              [style['status-nok']]: statusHigh > 1
                            })}
                          />
                          <i
                            class={cx('fe', 'fe-battery', {
                              'fe-battery-charging': statusHigh <= 1 && battery < 100,
                              [style['status-nok']]: statusHigh > 1
                            })}
                          />
                          <i
                            class={cx('fe', 'fe-chevrons-right', {
                              [style['status-ok']]: statusHigh <= 1,
                              [style['status-nok']]: statusHigh > 1
                            })}
                          />
                          <i class={cx('fe', 'fe-home')}/>
                        </td>
                        <td>
                          <div class={cx(style.level, style[batteryLevelClassname])}>
                            <Text id="global.percentValue" fields={{ value: battery }} />
                          </div>
                          <Text id="global.percentValue" fields={{ value: battery }} /> (
                          <RelativeTime datetime={lastValueChanged} language={user.language} futureDisabled />)
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Text id="dashboard.boxes.ups.batteryVoltage" />
                        </td>
                        <td>
                          {batteryVoltage} / {batteryVoltageNominal} <Text id={`deviceFeatureUnitShort.volt`} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

class UpsBoxComponent extends Component {
  refreshData = () => {
    this.props.getUps(this.props.box, this.props.x, this.props.y);
  };

  updateDeviceStateWebsocket = payload => {
    if (payload.device_feature_selector.startsWith(DASHBOARD_BOX_TYPE.UPS)) {
      this.refreshData();
    }
  };

  componentDidMount() {
    this.refreshData();
    this.props.session.dispatcher.addListener(
      WEBSOCKET_MESSAGE_TYPES.DEVICE.NEW_STATE,
      this.updateDeviceStateWebsocket
    );
  }

  componentWillUnmount() {
    this.props.session.dispatcher.removeListener(
      WEBSOCKET_MESSAGE_TYPES.DEVICE.NEW_STATE,
      this.updateDeviceStateWebsocket
    );
  }

  render(props, {}) {
    const boxData = get(props, `${DASHBOARD_BOX_DATA_KEY}Ups.${props.x}_${props.y}`);

    const upsObjectList = get(boxData, 'ups');

    return <>{upsObjectList && upsObjectList.map(upsObject => <UpsBox user={props.user} upsObject={upsObject} />)}</>;
  }
}

export default connect('DashboardBoxDataUps,DashboardBoxStatusUps,user,session', actions)(UpsBoxComponent);
