'use strict';

const Homey = require('homey');
const { LiveApi } = require('../../lib/telldus-api/index');
const util = require('../../lib/util');

module.exports = class ClientDriver extends Homey.Driver {

    async onPair(session) {
        session.setHandler('keys_entered', async (data) => {
            try {
                this._keys = {
                    key: data.public_key,
                    secret: data.secret_key,
                    tokenKey: data.token_key,
                    tokenSecret: data.token_secret
                };

                this._api = new LiveApi(this._keys, { log: this.log });

                session.showView('list_devices');
            } catch (err) {
                this.log('keys_entered ERROR', err);
                throw err;
            }
        });

        session.setHandler('list_devices', async (data) => {
            try {
                const clients = await this.getClients();
                return clients;
            } catch (err) {
                this.log('list_devices ERROR', err);
                throw err;
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
