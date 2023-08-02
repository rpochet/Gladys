import { Text } from 'preact-i18n';
import cx from 'classnames';
import style from './style.css';

const EmptyState = ({ currentIntegration }) => {
  let messageKey = `integration.${currentIntegration && currentIntegration.name}.discover.noDeviceDiscovered`;
  return (
    <div class="col-md-12">
      <div class={cx('text-center', style.emptyStateDivBox)}>
        <Text id={messageKey} />
      </div>
    </div>
  );
};

export default EmptyState;
