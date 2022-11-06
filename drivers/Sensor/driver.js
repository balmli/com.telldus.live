'use strict';

const Homey = require('homey');
const constantsDriver = require('../../lib/constants');
const constantsTelldus = require('../../lib/telldus-api/constants');

module.exports = class SensorDriver extends Homey.Driver {

    async onPairListDevices() {
        try {
            const apis = this.homey.app.getApi();
            let devices = [];

            for (let api of apis) {
                const telldusClientId = api.clientId;
                const online = true;
                const telldusSensors = await api.api.listSensors({
                    telldusClientId: api.driverId === constantsDriver.DRIVER_CLIENT_LIVE ? telldusClientId : undefined,
                    online
                });

                for (let telldusSensor of telldusSensors) {
                    let capabilities = [];
                    if (telldusSensor.data && telldusSensor.data.length > 0) {
                        for (let val of telldusSensor.data) {
                            if (val.name === 'temp') {
                                capabilities.push('measure_temperature');
                            } else if (val.name === 'humidity') {
                                capabilities.push('measure_humidity');
                            } else if (val.name === 'watt') {
                                if (val.unit === 'kWh') {
                                    capabilities.push('meter_power');
                                } else if (val.unit === 'W') {
                                    capabilities.push('measure_power');
                                } else if (val.unit === 'V') {
                                    capabilities.push('measure_voltage');
                                }
                            }
                        }
                    }
                    if (telldusSensor.battery) {
                        let batteryValue = parseFloat(telldusSensor.battery);
                        if (batteryValue == constantsTelldus.BATTERY_STATUS.ok || batteryValue == constantsTelldus.BATTERY_STATUS.low) {
                            capabilities.push('alarm_battery');
                        } else if (batteryValue >= 0 && batteryValue <= 100) {
                            capabilities.push('measure_battery');
                        }
                    }
                    if (capabilities.length > 0) {
                        devices.push({
                            "name": `${telldusSensor.name}${api.shortName ? ' (' + api.shortName + ')' : ''}`,
                            "data": {
                                "id": telldusSensor.id,
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
            throw new Error("Failed to retrieve sensors.");
        }
    }

};
