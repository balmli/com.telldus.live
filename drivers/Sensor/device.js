'use strict';

const BaseDevice = require('../../lib/BaseDevice');

module.exports = class SensorDevice extends BaseDevice {

    onSensorValue(sensor) {
        try {
            if (sensor && sensor.id === this.getId()) {
                //this.log('onSensorValue', this.getId(), sensor);
                //this.log(`${sensor.name}`, sensor.data.map(v => `${v.name} = ${v.value}`).join(', '));
                for (let val of sensor.data) {
                    if (val.name === 'temp') {
                        this.updateValue('measure_temperature', sensor, val);
                    } else if (val.name === 'humidity') {
                        this.updateValue('measure_humidity', sensor, val);
                    } else if (val.name === 'watt') {
                        if (val.unit === 'kWh') {
                            this.updateValue('meter_power', sensor, val);
                        } else if (val.unit === 'W') {
                            this.updateValue('measure_power', sensor, val);
                        } else if (val.unit === 'V') {
                            this.updateValue('measure_voltage', sensor, val);
                        }
                    }
                }
            }
        } catch (err) {
            this.log('onSensorValue error', err);
        }
    }

    updateValue(capability, sensor, val) {
        if (this.hasCapability(capability)) {
            const value = parseFloat(val.value);
            if (value !== this.getCapabilityValue(capability)) {
                this.setCapabilityValue(capability, value).catch(err => this.log(`error setting ${capability} capability`, err));
                this.log(`${sensor.name} => ${value} UPDATED`);
            }
        }
    }

};
