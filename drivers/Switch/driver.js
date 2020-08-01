'use strict';

const Homey = require('homey');
const constants = require('../../lib/telldus-api/constants');
const constantsDriver = require('../../lib/constants');

module.exports = class SwitchDriver extends Homey.Driver {

    async onPairListDevices(data, callback) {
        try {
            const apis = Homey.app.getApi();
            let devices = [];

            for (let api of apis) {
                const telldusClientId = api.clientId;
                const filterDeviceType = constants.DEVICE_TYPES.switch;
                const telldusDevices = await api.api.listDevices({
                    telldusClientId: api.driverId === constantsDriver.DRIVER_CLIENT_LIVE ? telldusClientId : undefined,
                    filterDeviceType
                });

                for (let telldusDevice of telldusDevices) {
                    devices.push({
                        "name": `${telldusDevice.name}${api.shortName ? ' (' + api.shortName + ')' : ''}`,
                        "data": {
                            "id": telldusDevice.id,
                            "clientId": telldusClientId
                        }
                    });
                }
            }

            callback(null, devices);

        } catch (err) {
            this.log('onPairListDevices error', err);
            callback(new Error("Failed to retrieve switches."));
        }
    }

};
