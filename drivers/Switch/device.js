'use strict';

const BaseDevice = require('../../lib/BaseDevice');

module.exports = class SwitchDevice extends BaseDevice {

    onInit() {
        this.registerCapabilityListener('onoff', (value, opts) => {
            return this.onUpdateOnOff(value, opts);
        });
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


};
