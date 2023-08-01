import { Text, Localizer } from 'preact-i18n';
import cx from 'classnames';

import EmptyState from './EmptyState';
import style from './style.css';
import { RequestStatus } from '../../../../../utils/consts';
import Device from './Device';
import CheckUpsPanel from '../commons/CheckUpsPanel';
import CardFilter from '../../../../../components/layout/CardFilter';

const UpsDevicesTab = ({ children, ...props }) => {
  return (
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <Text id="integration.ups.device.title" />
        </h3>
        <div class="page-options d-flex">
          <Localizer>
            <CardFilter
              changeOrderDir={props.changeOrderDir}
              orderValue={props.getUpsDeviceOrderDir}
              search={props.debouncedSearch}
              searchValue={props.upsDeviceSearch}
              searchPlaceHolder={<Text id="device.searchPlaceHolder" />}
            />
          </Localizer>
          <button class="btn btn-outline-primary" onClick={props.scanNetwork}>
            <Text id="integration.ups.discover.scanButton" /> <i class="fe fe-radio" />
          </button>
        </div>
      </div>
      <div class="card-body">
        <CheckUpsPanel />

        <div
          class={cx('dimmer', {
            active: props.getUpsDevicesStatus === RequestStatus.Getting
          })}
        >
          <div class="loader" />
          <div class="dimmer-content">
            <div class="row">
              {props.upsDevices && props.upsDevices.length === 0 && <EmptyState {...props} />}
              {props.getUpsDevicesStatus === RequestStatus.Getting && <div class={style.emptyDiv} />}
              {props.upsDevices &&
                props.upsDevices.map((upsDevice, index) => (
                  <Device
                    device={upsDevice}
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

export default UpsDevicesTab;
