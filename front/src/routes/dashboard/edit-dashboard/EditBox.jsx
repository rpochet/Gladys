import EditWeatherBox from '../../../components/boxs/weather/EditWeatherBox';
import EditRoomTemperatureBox from '../../../components/boxs/room-temperature/EditRoomTemperatureBox';
import EditRoomHumidityBox from '../../../components/boxs/room-humidity/EditRoomHumidityBox';
import EditCameraBox from '../../../components/boxs/camera/EditCamera';
import EditAtHomeBox from '../../../components/boxs/user-presence/EditUserPresenceBox';
import EditDevicesInRoom from '../../../components/boxs/device-in-room/EditDeviceInRoom';
import EditDevices from '../../../components/boxs/device-in-room/EditDevices';
import EditChart from '../../../components/boxs/chart/EditChart';
import EditEcowatt from '../../../components/boxs/ecowatt/EditEcowatt';
import EditClock from '../../../components/boxs/clock/EditClock';
import EditUpsBox from '../../../components/boxs/ups/EditUpsBox';

import SelectBoxType from '../../../components/boxs/SelectBoxType';
import EditSceneBox from '../../../components/boxs/scene/EditSceneBox';

const Box = ({ children, ...props }) => {
  switch (props.box.type) {
    case 'weather':
      return <EditWeatherBox {...props} />;
    case 'user-presence':
      return <EditAtHomeBox {...props} />;
    case 'camera':
      return <EditCameraBox {...props} />;
    case 'temperature-in-room':
      return <EditRoomTemperatureBox {...props} />;
    case 'humidity-in-room':
      return <EditRoomHumidityBox {...props} />;
    case 'devices-in-room':
      return <EditDevicesInRoom {...props} />;
    case 'devices':
      return <EditDevices {...props} />;
    case 'chart':
      return <EditChart {...props} />;
    case 'ecowatt':
      return <EditEcowatt {...props} />;
    case 'clock':
      return <EditClock {...props} />;
    case 'ups':
      return <EditUpsBox {...props} />;
    case 'scene':
      return <EditSceneBox {...props} />;
    default:
      return <SelectBoxType {...props} />;
  }
};

export default Box;
