'use strict';

const Homey = require('homey');
const { LocalApi } = require('../../lib/telldus-api/index');
const util = require('../../lib/util');

module.exports = class ClientDriver extends Homey.Driver {

    onPair(socket) {
        socket.on('keys_entered', async (data, callback) => {
            try {
                this._keys = {
                    ip_address: data.ip_address,
                    access_token: data.access_token
                };

                const host = data.ip_address;
                const accessToken = data.access_token;
                this._api = new LocalApi({ host, accessToken, log: this.log });

                socket.showView('list_devices');
                callback(null, 'ok');
            } catch (err) {
                callback(err);
            }
        });

        socket.on('list_devices', async (data, callback) => {
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
                callback(null, devices);
            } catch (err) {
                callback(err);
            }
        });
    }

};
