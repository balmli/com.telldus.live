'use strict';

const Homey = require('homey');

module.exports = class BaseDevice extends Homey.Device {

    getId() {
        return this.getData().id;
    }

    getClientId() {
        return this.getData().clientId;
    }

    getApi() {
        return Homey.app.getApi(this.getClientId());
    }

};