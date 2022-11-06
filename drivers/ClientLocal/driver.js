'use strict';

const Homey = require('homey');
const { LocalApi } = require('../../lib/telldus-api/index');
const util = require('../../lib/util');

module.exports = class ClientDriver extends Homey.Driver {

    async onPair(session) {
        session.setHandler('keys_entered', async (data) => {
            try {
                this._keys = {
                    ip_address: data.ip_address,
                    access_token: data.access_token
                };

                const host = data.ip_address;
                const accessToken = data.access_token;
                this._api = new LocalApi({ host, accessToken, log: this.log });

                session.showView('list_devices');
            } catch (err) {
                throw err;
            }
        });

        session.setHandler('list_devices', async (data) => {
            try {
                let devices = [];
                devices.push({
                    "name": `Telldus Local ${this._keys.ip_address}`,
                    "data": {
                        "id": this._keys.ip_address,
                        "uuid": util.guid()
                    },
                    "store": {
                        "keys": this._keys
                    }
                });
                return devices;
            } catch (err) {
                throw err;
            }
        });
    }

};
