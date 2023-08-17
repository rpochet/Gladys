const logger = require('../../../../utils/logger');

/**
 * @description Convert Callback-like function to Promise-like function.
 * @param {Function} f - Funtion to promised.
 * @returns {Function} - The promised function.
 * @example promisify(() => {})
 */
function promisify(f) {
  return function promisifyCallback(...args) {
    // return a wrapper-function (*)
    return new Promise((resolve, reject) => {
      /**
       * @description Convert Callback to Promise.
       * @param {object} result - Function result.
       * @param {object} err - Function error.
       * @example callback({}, '')
       */
      function callback(result, err) {
        // our custom callback for f (**)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custom callback to the end of f arguments

      f.call(this, ...args); // call the original function
    });
  };
}

class NutClient {
  constructor(Nut, nutHost, nutPort) {
    this.nutHost = nutHost;
    this.nutPort = nutPort;

    this.upsNut = new Nut(nutPort, nutHost);

    this.GetUPSListP = promisify(this.upsNut.GetUPSList).bind(this.upsNut);
    this.GetUPSVarsP = promisify(this.upsNut.GetUPSVars).bind(this.upsNut);

    this.upsNut.on('error', (err) => {
      logger.error(`There was an error with UPS: ${err}`);
      this.connected = false;
    });

    this.upsNut.on('close', () => {
      logger.info(`UPS Connection closed.`);
      this.connected = false;
    });

    this.upsNut.on('ready', async () => {
      logger.info(`UPS Connected.`);
      this.connected = true;
    });
  }

  isConnected() {
    return this.connected;
  }

  async connect() {
    try {
      this.upsNut.start();
    } catch (e) {
      throw new Error(`Unable to connect Nut server ${this.nutHost}:${this.nutPort} - ${e}`);
    }
  }

  async getNodes() {
    if (!this.connected) {
      await this.connect();
    }
    const nodes = {};
    try {
      const upslist = await this.GetUPSListP();
      (
        await Promise.all(
          Object.keys(upslist).map(async (upsName) => {
            return [upsName, await this.GetUPSVarsP(upsName)];
          }),
        )
      ).forEach((ups) => {
        const [upsName, upsVars] = ups;
        nodes[upsName] = upsVars;
      });
    } catch (err) {
      logger.error(`Error getting UPS List: ${err}`);
    }
    return nodes;
  }

  close() {
    logger.info(`cLosing UPS Connection ${this.nutHost}:${this.nutPort}.`);
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = {
  NutClient,
};
