import { Component } from 'preact';
import { connect } from 'unistore/preact';
import { Text } from 'preact-i18n';
import style from './style.css';
import cx from 'classnames';

import { PARAM_NAMES } from '../../../../../server/services/ups/lib/constants';
import actions from '../../../actions/dashboard/boxes/ups';
import { RequestStatus, GetUpsStatus, DASHBOARD_BOX_STATUS_KEY, DASHBOARD_BOX_DATA_KEY } from '../../../utils/consts';
import get from 'get-value';

const BOX_REFRESH_INTERVAL_MS = 30 * 60 * 1000;

class UpsBox extends Component {
  render({ ...props }) {
    const { loading, upsObject } = props;
    const name = upsObject.name;
    const status = upsObject.features.find(feature => feature.name === PARAM_NAMES.UPS_STATUS).last_value;
    const battery = upsObject.features.find(feature => feature.name === PARAM_NAMES.BATTERY_CHARGE).last_value;
    const batteryVoltage = upsObject.features.find(feature => feature.name === PARAM_NAMES.BATTERY_VOLTAGE).last_value;
    const batteryVoltageNominal = upsObject.features.find(
      feature => feature.name === PARAM_NAMES.BATTERY_VOLTAGE_NOMINAL
    ).last_value;

    const batteryLevelClassname = `level-${(battery / 10) * 10}`;

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
                <div class="dimmer-content" style={padding} />
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
                active: loading
              })}
            >
              <div class="loader py-3" />
              <div class="dimmer-content">
                <div class="table-responsive">
                  <table class="table card-table table-vcenter">
                    <tbody>
                      <tr>
                        <td>Status: </td>
                        <td>
                          <i
                            class={cx('fe', {
                              'fe-zap': status === 0,
                              'fe-zap-off': status !== 0
                            })}
                          ></i>
                          <i
                            class={cx('fe', {
                              'fe-chevrons-right': status === 0,
                              [style['status-ok']]: status === 0,
                              [style['status-nok']]: status !== 0
                            })}
                          ></i>
                          <i
                            class={cx('fe', {
                              'fe-battery': status === 0,
                              'fe-battery-charging': status === 0 && battery < 100
                            })}
                          ></i>
                          <i
                            class={cx('fe', {
                              'fe-chevrons-right': status === 0,
                              [style['status-ok']]: status === 0,
                              [style['status-nok']]: status !== 0
                            })}
                          ></i>
                          <i
                            class={cx('fe', {
                              'fe-home': status === 0
                            })}
                          ></i>
                          <div class={cx(style.level, style[batteryLevelClassname])}>
                            <Text id="global.percentValue" fields={{ value: battery }} />
                          </div>
                          <Text id="global.percentValue" fields={{ value: battery }} />
                        </td>
                      </tr>
                      <tr>
                        <td>Batterie voltage: </td>
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
  componentDidMount() {
    this.refreshData();
    // refresh ups every interval
    this.interval = setInterval(() => this.refreshData(), BOX_REFRESH_INTERVAL_MS);
  }

  componentDidUpdate(previousProps) {
    const houseChanged = get(previousProps, 'box.house') !== get(this.props, 'box.house');
    if (houseChanged) {
      this.refreshData();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render(props, {}) {
    const boxData = get(props, `${DASHBOARD_BOX_DATA_KEY}Ups.${props.x}_${props.y}`);
    const boxStatus = get(props, `${DASHBOARD_BOX_STATUS_KEY}Ups.${props.x}_${props.y}`);
    const displayMode = this.props.box.modes || {};

    const upsObjectList = get(boxData, 'ups');

    return <>{upsObjectList && upsObjectList.map(upsObject => <UpsBox upsObject={upsObject} />)}</>;
  }
}

export default connect('DashboardBoxDataUps,DashboardBoxStatusUps,user', actions)(UpsBoxComponent);
