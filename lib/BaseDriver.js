'use strict';

const Homey = require('homey');
const constants = require('./telldus-api/constants');
const constantsDriver = require('./constants');

module.exports = class BaseDriver extends Homey.Driver {

    async onPairListDevices() {
        try {
            const apis = this.homey.app.getApi();
            let devices = [];

            for (let api of apis) {
                const telldusClientId = api.clientId;
                const deviceTypes = this.getDeviceTypes();
                const methods = this.getMethods();
                const telldusDevices = await api.api.listDevices({
                    telldusClientId: api.driverId === constantsDriver.DRIVER_CLIENT_LIVE ? telldusClientId : undefined,
                    deviceTypes,
                    methods
                });

                for (let telldusDevice of telldusDevices) {
                    let capabilities = [];
                    if (telldusDevice.methods) {
                        if ((constants.commands.on & telldusDevice.methods) > 0 &&
                            (constants.commands.off & telldusDevice.methods) > 0) {
                            capabilities.push('onoff');
                        }
                        if ((constants.commands.dim & telldusDevice.methods) > 0) {
                            capabilities.push('dim');
                        }
                    } else {
                        capabilities = this.getDefaultCapabilities();
                    }
                    if (capabilities.length > 0) {
                        devices.push({
                            "name": `${telldusDevice.name}${api.shortName ? ' (' + api.shortName + ')' : ''}`,
                            "data": {
                                "id": telldusDevice.id,
                                "clientId": telldusClientId
                            },
                            "capabilities": capabilities
                        });
                    }
                }
            }

            return devices;

        } catch (err) {
            this.log('onPairListDevices error', err);
            throw new Error("Failed to retrieve devices.");
        }
    }

    getDeviceTypes() {
        return undefined;
    }

    getMethods() {
        return undefined;
    }

    getDefaultCapabilities() {
        return [];
    }

};
