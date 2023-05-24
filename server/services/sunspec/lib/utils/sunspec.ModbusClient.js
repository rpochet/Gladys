const logger = require('../../../../utils/logger');
const { REGISTER, DEFAULT } = require('../sunspec.constants');
const { trimString } = require('./sunspec.utils');

class ModbusClient {
  constructor(modbusClient) {
    this.modbusClient = modbusClient;
    this.models = {};
  }

  async connect(sunspecHost, sunspecPort) {
    return new Promise((resolve, reject) => {
      this.modbusClient.connectTCP(sunspecHost, { port: sunspecPort }, async () => {
        logger.info(`SunSpec service connected`);
        // this.modbusClient.setID(UNIT_ID.SID);
        const sid = await this.readRegisterAsInt32(REGISTER.SID);
        if (sid !== DEFAULT.SUNSPEC_MODBUS_MAP) {
          reject(new Error(`Invalid SID received. Expected ${DEFAULT.SUNSPEC_MODBUS_MAP} but got ${sid}`));
        }
        const model = await this.readRegisterAsInt16(REGISTER.MODEL_ID);
        if (model !== DEFAULT.SUNSPEC_COMMON_MODEL) {
          reject(
            new Error(`Invalid SunSpec Model received. Expected ${DEFAULT.SUNSPEC_COMMON_MODEL} but got ${model}`),
          );
        }
        this.models[1] = {
          registerStart: REGISTER.MODEL_ID,
          registerLength: await this.readRegisterAsInt16(REGISTER.MODEL_ID + 1),
        };
        let nextModel;
        let nextModelLength;
        let registerId = REGISTER.MODEL_ID + 1;
        registerId += (await this.readRegisterAsInt16(registerId)) + 1;
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          nextModel = await this.readRegisterAsInt16(registerId);
          if (nextModel === 0xffff) {
            break;
          }
          // eslint-disable-next-line no-await-in-loop
          nextModelLength = await this.readRegisterAsInt16(registerId + 1);
          // eslint-disable-next-line no-await-in-loop
          this.models[nextModel] = {
            registerStart: registerId,
            registerLength: nextModelLength,
          };
          registerId += nextModelLength + 2;
        }

        // TODO Got unit ID at register 40069
        resolve();
      });
    });
  }

  async readModel(modelId) {
    const { registerStart, registerLength } = this.models[modelId];
    return this.readRegister(registerStart, registerLength);
  }

  async readRegister(registerId, registerLength) {
    return new Promise((resolve, reject) => {
      this.modbusClient.readHoldingRegisters(registerId - 1, registerLength, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.buffer);
        }
      });
    });
  }

  async readRegisterAsString(registerId, registerLength) {
    return new Promise((resolve, reject) => {
      this.modbusClient.readHoldingRegisters(registerId - 1, registerLength, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const res = data.buffer.toString();
          resolve(trimString(res));
        }
      });
    });
  }

  async readRegisterAsInt16(registerId) {
    return new Promise((resolve, reject) => {
      this.modbusClient.readHoldingRegisters(registerId - 1, 1, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const res = data.data[0];
          resolve(res);
        }
      });
    });
  }

  async readRegisterAsInt32(registerId) {
    return new Promise((resolve, reject) => {
      this.modbusClient.readHoldingRegisters(registerId - 1, 2, (err, data) => {
        if (err) {
          reject(err);
        } else {
          // eslint-disable-next-line no-bitwise
          const res = (data.data[0] << 16) | data.data[1];
          resolve(res);
        }
      });
    });
  }
}

module.exports = {
  ModbusClient,
};