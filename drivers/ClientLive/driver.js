'use strict';

const Homey = require('homey');
const { LiveApi } = require('../../lib/telldus-api/index');
const util = require('../../lib/util');

module.exports = class ClientDriver extends Homey.Driver {

    onPair(socket) {
        socket.on('keys_entered', async (data, callback) => {
            try {
                this._keys = {
                    key: data.public_key,
                    secret: data.secret_key,
                    tokenKey: data.token_key,
                    tokenSecret: data.token_secret
                };

                this._api = new LiveApi(this._keys, { log: this.log });

                socket.showView('list_devices');
                callback(null, 'ok');
            } catch (err) {
                this.log('keys_entered ERROR', err);
                callback(err);
            }
        });

        socket.on('list_devices', async (data, callback) => {
            try {
                const clients = await this.getClients();
                callback(null, clients);
            } catch (err) {
                this.log('list_devices ERROR', err);
                callback(err);
            }
        });
    }

    async getClients() {
        if (!this._api) {
            throw new Error('No API defined.');
        }
        const result = await this._api.listClients();
        let devices = [];
        if (result && result.client) {
            for (let client of result.client) {
                devices.push({
                    "name": `Telldus Live ${client.name}`,
                    "data": {
                        "id": client.id,
                        "uuid": util.guid()
                    },
                    "store": {
                        "keys": this._keys
                    }
                });
            }
        }
        return devices;
    }

};
