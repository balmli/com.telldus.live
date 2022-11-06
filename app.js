'use strict';

const Homey = require('homey');
const constants = require('./lib/constants');

module.exports = class TelldusLiveApp extends Homey.App {

    onInit() {
        try {
            this.homey.on('unload', () => this._onUninstall());

            this.log('TelldusLiveApp is running...');
        } catch (err) {
            this.log('onInit error', err);
        }
    }

    sensorValues(telldusSensors) {
        const drivers = this.homey.drivers.getDrivers();
        if (drivers) {
            for (let key in drivers) {
                if (drivers.hasOwnProperty(key)) {
                    const driver = drivers[key];
                    const devices = driver.getDevices();
                    for (let device of devices) {
                        if (device.getId && device.onSensorValue) {
                            const telldusSensor = telldusSensors.find(s => s.id === device.getId());
                            device.onSensorValue(telldusSensor);
                        }
                    }
                }
            }
        }
    }

    deviceValues(telldusDevices) {
        const drivers = this.homey.drivers.getDrivers();
        if (drivers) {
            for (let key in drivers) {
                if (drivers.hasOwnProperty(key)) {
                    const driver = drivers[key];
                    const devices = driver.getDevices();
                    for (let device of devices) {
                        if (device.getId) {
                            const telldusDevice = telldusDevices.find(d => d.id === device.getId());
                            if (device.hasCapability('onoff') && device.onSwitchValue) {
                                device.onSwitchValue(telldusDevice);
                            }
                            if (device.hasCapability('dim') && device.onDimValue) {
                                device.onDimValue(telldusDevice);
                            }
                        }
                    }
                }
            }
        }
    }

    getApi(clientId) {
        const apis = [];
        for (let driverId of constants.DRIVER_CLIENTS) {
            const driver = this.homey.drivers.getDriver(driverId);
            if (driver) {
                const devices = driver.getDevices();
                for (let device of devices) {
                    if (device.getId && device.getApi) {
                        if (clientId && clientId === device.getId()) {
                            return device.getApi();
                        }
                        apis.push({
                            shortName: device.getShortName(),
                            api: device.getApi(),
                            clientId: device.getId(),
                            driverId: driverId
                        });
                    }
                }
            }
        }
        return apis;
    }

    _onUninstall() {
        try {
            this._clearTimers();
        } catch (err) {
            this.log('_onUninstall error', err);
        }
    }

    _clearTimers() {
        const drivers = this.homey.drivers.getDrivers();
        if (drivers) {
            for (let key in drivers) {
                if (drivers.hasOwnProperty(key)) {
                    const driver = drivers[key];
                    const devices = driver.getDevices();
                    for (let device of devices) {
                        if (device.clearCheckData) {
                            device.clearCheckData();
                        }
                    }
                }
            }
        }
    }

};
