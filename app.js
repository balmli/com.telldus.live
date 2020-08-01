'use strict';

const Homey = require('homey');
const constants = require('./lib/constants');

module.exports = class TelldusLiveApp extends Homey.App {

    onInit() {
        try {
            Homey.on('unload', () => this._onUninstall());

            this.triggerClientOffline = new Homey.FlowCardTriggerDevice('client_offline');
            this.triggerClientOffline
                .register();

            this.triggerClientOnline = new Homey.FlowCardTriggerDevice('client_online');
            this.triggerClientOnline
                .register();

            this.log('TelldusLiveApp is running...');
        } catch (err) {
            this.log('onInit error', err);
        }
    }

    sensorValues(telldusSensors) {
        const drivers = Homey.ManagerDrivers.getDrivers();
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
        const drivers = Homey.ManagerDrivers.getDrivers();
        if (drivers) {
            for (let key in drivers) {
                if (drivers.hasOwnProperty(key)) {
                    const driver = drivers[key];
                    const devices = driver.getDevices();
                    for (let device of devices) {
                        if (device.getId && device.onSwitchValue) {
                            const telldusDevice = telldusDevices.find(d => d.id === device.getId());
                            device.onSwitchValue(telldusDevice);
                        }
                    }
                }
            }
        }
    }

    getApi(clientId) {
        const apis = [];
        for (let driverId of constants.DRIVER_CLIENTS) {
            const driver = Homey.ManagerDrivers.getDriver(driverId);
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
        const drivers = Homey.ManagerDrivers.getDrivers();
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
