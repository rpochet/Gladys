import { Text, Localizer } from 'preact-i18n';
import cx from 'classnames';

import EmptyState from './EmptyState';
import style from './style.css';
import { RequestStatus } from '../../../../../utils/consts';
import Device from './Device';
import CardFilter from '../../../../../components/layout/CardFilter';

const DeviceTab = ({ children, ...props }) => {
  return (
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <Text
            id="device.title"
            fields={{
              integrationName: props.currentIntegration && props.currentIntegration.name
            }}
          />
        </h3>
        <div class="page-options d-flex">
          <Localizer>
            <CardFilter
              changeOrderDir={props.changeOrderDir}
              orderValue={props.getDeviceOrderDir}
              search={props.debouncedSearch}
              searchValue={props.deviceSearch}
              searchPlaceHolder={<Text id="device.searchPlaceHolder" />}
            />
          </Localizer>
        </div>
      </div>
      <div class="card-body">
        <div
          class={cx('dimmer', {
            active: props.getDevicesStatus === RequestStatus.Getting
          })}
        >
          <div class="loader" />
          <div class="dimmer-content">
            {props.devices && props.devices.length === 0 && <EmptyState {...props} />}
            {props.getDevicesStatus === RequestStatus.Getting && <div class={style.emptyDiv} />}
            <div class="row">
              {props.devices &&
                props.devices.map((device, index) => (
                  <Device
                    device={device}
                    deviceIndex={index}
                    houses={props.houses}
                    updateDeviceProperty={props.updateDeviceProperty}
                    saveDevice={props.saveDevice}
                    deleteDevice={props.deleteDevice}
                    user={props.user}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceTab;
