const { trimString } = require('./sunspec.utils');

class ModelFactory {
  static createModel(data) {
    const type = data.readUInt16BE(0);
    // Skip length
    // const length = data.readUInt16BE(2);
    let offset = 4;

    const res = {};
    switch (type) {
      case 1:
        res.manufacturer = trimString(data.subarray(4, 36).toString());
        res.product = trimString(data.subarray(36, 36 + 48).toString());
        res.swVersion = trimString(data.subarray(84, 84 + 16).toString());
        res.serialNumber = trimString(data.subarray(100, 100 + 32).toString());
        break;
      case 160: {
        const DCA_SF = data.readInt16BE(offset);
        offset += 2;
        const DCV_SF = data.readInt16BE(offset);
        offset += 2;
        const DCW_SF = data.readInt16BE(offset);
        offset += 2;
        const DCWH_SF = data.readInt16BE(offset);
        offset += 2;
        res.Evt = data.readUInt32BE(offset);
        offset += 4;
        res.N = data.readUInt16BE(offset);
        offset += 2;
        res.TmsPer = data.readUInt16BE(offset);
        offset += 2;

        res.S1_ID = data.readUInt16BE(offset);
        offset += 2;
        res.S1_IDStr = trimString(data.subarray(offset, offset + 16).toString());
        offset += 16;
        res.S1_DCA = data.readUInt16BE(offset) * 10 ** DCA_SF;
        offset += 2;
        res.S1_DCV = data.readUInt16BE(offset) * 10 ** DCV_SF;
        offset += 2;
        res.S1_DCW = data.readUInt16BE(offset) * 10 ** DCW_SF;
        offset += 2;
        res.S1_DCWH = data.readUInt32BE(offset) * 10 ** DCWH_SF;
        offset += 2;
        res.S1_Tms = data.readUInt32BE(offset);
        offset += 4;
        res.S1_Tmp = data.readUInt16BE(offset);
        offset += 2;
        res.S1_DCSt = data.readUInt16BE(offset);
        offset += 2;
        res.S1_DCEvt = data.readUInt16BE(offset);
        offset += 2;

        res.S2_ID = data.readUInt16BE(offset);
        offset += 2;
        res.S2_IDStr = trimString(data.subarray(offset, offset + 16).toString());
        offset += 16;
        res.S2_DCA = data.readUInt16BE(offset) * 10 ** DCA_SF;
        offset += 2;
        res.S2_DCV = data.readUInt16BE(offset) * 10 ** DCV_SF;
        offset += 2;
        res.S2_DCW = data.readUInt16BE(offset) * 10 ** DCW_SF;
        offset += 2;
        res.S2_DCWH = data.readUInt32BE(offset) * 10 ** DCWH_SF;
        offset += 4;
        res.S2_Tms = data.readUInt32BE(offset);
        offset += 4;
        res.S2_Tmp = data.readUInt16BE(offset);
        offset += 2;
        res.S2_DCSt = data.readUInt16BE(offset);
        offset += 2;
        res.S2_DCEvt = data.readUInt16BE(offset);
        offset += 2;
        break;
      }
      default:
        return new Error('Model ID not supported');
    }
    return res;
  }
}

module.exports = {
  ModelFactory,
};
