'use strict';

const Homey = require('homey');
const constantsDriver = require('../../lib/constants');

module.exports = class SensorDriver extends Homey.Driver {

    async onPairListDevices(data, callback) {
        try {
            const apis = Homey.app.getApi();
            let devices = [];

            for (let api of apis) {
                const telldusClientId = api.clientId;
                const online = true;
                const telldusSensors = await api.api.listSensors({
                    telldusClientId: api.driverId === constantsDriver.DRIVER_CLIENT_LIVE ? telldusClientId : undefined,
                    online
                });

                for (let telldusSensor of telldusSensors) {
                    if (telldusSensor.data && telldusSensor.data.length > 0) {
                        let capabilities = [];
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
            }

            callback(null, devices);

        } catch (err) {
            callback(new Error("Failed to retrieve sensors."));
        }
    }

};
