'use strict';

const Homey = require('homey');

module.exports = class BaseDevice extends Homey.Device {

    getId() {
        return this.getData().id;
    }

    getClientId() {
        return this._clientId;
    }

    setClientId(id) {
        this._clientId = id;
    }

    getApi() {
        return Homey.app.getApi(this._clientId);
    }

};