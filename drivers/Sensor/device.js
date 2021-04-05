'use strict';

const BaseDevice = require('../../lib/BaseDevice');
const constantsTelldus = require('../../lib/telldus-api/constants');

module.exports = class SensorDevice extends BaseDevice {

    onSensorValue(sensor) {
        try {
            if (sensor && sensor.id === this.getId()) {
                //this.log('onSensorValue', this.getId(), sensor);
                //this.log(`${sensor.name}`, sensor.data.map(v => `${v.name} = ${v.value}`).join(', '));
                for (let val of sensor.data) {
                    let measureValue = parseFloat(val.value);
                    if (val.name === 'temp') {
                        this.updateValue('measure_temperature', sensor, measureValue);
                    } else if (val.name === 'humidity') {
                        this.updateValue('measure_humidity', sensor, measureValue);
                    } else if (val.name === 'watt') {
                        if (val.unit === 'kWh') {
                            this.updateValue('meter_power', sensor, measureValue);
                        } else if (val.unit === 'W') {
                            this.updateValue('measure_power', sensor, measureValue);
                        } else if (val.unit === 'V') {
                            this.updateValue('measure_voltage', sensor, measureValue);
                        }
                    }
                }
                if (sensor.battery) {
                    //this.log(`${sensor.id} ${sensor.name} battery =`, sensor.battery);
                    let batteryValue = parseFloat(sensor.battery);
                    if (batteryValue == constantsTelldus.BATTERY_STATUS.ok) {
                        this.updateValue('alarm_battery', sensor, false);
                    } else if (batteryValue == constantsTelldus.BATTERY_STATUS.low) {
                        this.updateValue('alarm_battery', sensor, true);
                    } else if (batteryValue >= 0 && batteryValue <= 100) {
                        this.updateValue('measure_battery', sensor, batteryValue);
                    }
                }
            }
        } catch (err) {
            this.log('onSensorValue error', err);
        }
    }

    updateValue(capability, sensor, value) {
        if (!this.hasCapability(capability)) {
            this.addCapability(capability);
        }

        if (value !== this.getCapabilityValue(capability)) {
            this.setCapabilityValue(capability, value).catch(err => this.log(`error setting ${capability} capability`, err));
            this.log(`${sensor.name} ${capability} => ${value} UPDATED`);
        }
    }
};
