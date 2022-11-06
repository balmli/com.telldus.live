'use strict';

const Homey = require('homey');

module.exports = class BaseDevice extends Homey.Device {

    onInit() {
        if (this.hasCapability('onoff')) {
            this.registerCapabilityListener('onoff', (value, opts) => {
                return this.onUpdateOnOff(value, opts);
            });
        }
        if (this.hasCapability('dim')) {
            this.registerCapabilityListener('dim', (value, opts) => {
                return this.onUpdateDim(value, opts);
            });
        }
    }

    getId() {
        return this.getData().id;
    }

    getClientId() {
        return this.getData().clientId;
    }

    getApi() {
        return this.homey.app.getApi(this.getClientId());
    }

    onSwitchValue(device) {
        try {
            if (device && device.id === this.getId()) {
                //this.log('onSwitchValue', this.getId(), device);
                const onoff = device.state === '1' || device.state === 1;
                //this.log(`${device.name}: ${onoff ? 'on' : 'off'}`);
                if (onoff !== this.getCapabilityValue('onoff')) {
                    this.setCapabilityValue('onoff', onoff).catch(err => this.log('error setting onoff capability', err));
                    this.log(`${device.name}: ${onoff ? 'on' : 'off'} UPDATED`);
                }
            }
        } catch (err) {
            this.log('onSwitchValue error', err);
        }
    }

    async onUpdateOnOff(value, opts) {
        const api = this.getApi();
        if (!api) {
            this.log('ERROR: Missing API');
            return;
        }
        this.log(`set onoff: ${this.getId()} -> ${value}`);
        const result = await api.onOffDevice(this.getId(), value);
        if (result.status !== 'success') {
            throw new Error('Switch the device failed');
        }
        this.log(`set onoff OK: ${this.getId()} -> ${value}`);
    }

    onDimValue(device) {
        try {
            if (device && device.id === this.getId()) {
                //this.log('onDimValue', this.getId(), device);
                const dimValue = parseInt(device.statevalue);
                const dim = Math.round(dimValue * 100 / 255) / 100;
                //this.log(`${device.name}: ${dim}`, device);
                if (dim !== this.getCapabilityValue('dim')) {
                    this.setCapabilityValue('dim', dim).catch(err => this.log('error setting dim capability', err));
                    this.log(`${device.name}: ${dim} UPDATED`);
                }
            }
        } catch (err) {
            this.log('onDimValue error', err);
        }
    }

    async onUpdateDim(value, opts) {
        const api = this.getApi();
        if (!api) {
            this.log('ERROR: Missing API');
            return;
        }
        const dimValue = Math.round(value * 255);
        this.log(`set dim: ${this.getId()} -> ${value} : ${dimValue}`);
        const result = await api.dimDevice(this.getId(), dimValue);
        if (result.status !== 'success') {
            throw new Error('Dimming the device failed');
        }
        this.log(`set dim OK: ${this.getId()} -> ${dimValue}`);
    }

};