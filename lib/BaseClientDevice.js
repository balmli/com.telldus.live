'use strict';

const Homey = require('homey');

module.exports = class BaseClientDevice extends Homey.Device {

    onDeleted() {
        this._deleted = true;
        this.clearCheckData();
    }

    getId() {
        return this.getData().id;
    }

    getUuid() {
        return this.getData().uuid;
    }

    getApi() {
        return this._api;
    }

    getShortName() {
        return undefined;
    }

    async onSettings({oldSettings, newSettings, changedKeys}) {
        if (changedKeys.includes('Polling_Interval')) {
            this.scheduleCheckData(newSettings.Polling_Interval);
        }
    }

    async checkData() {
        if (this._deleted) {
            return;
        }
        try {
            this.clearCheckData();
            await this.fetchClientState();
            await this.fetchSensorValues();
            await this.fetchDevicesValues();
        } catch (err) {
            this.log('checkData error', err);
        } finally {
            this.scheduleCheckData();
        }
    }

    clearCheckData() {
        if (this.curTimeout) {
            this.homey.clearTimeout(this.curTimeout);
            this.curTimeout = undefined;
        }
    }

    async scheduleCheckData(seconds) {
        if (this._deleted) {
            return;
        }
        this.clearCheckData();
        let interval = seconds;
        if (!interval) {
            let settings = await this.getSettings();
            interval = settings.Polling_Interval || 30;
        }
        this.curTimeout = this.homey.setTimeout(this.checkData.bind(this), interval * 1000);
    }

};