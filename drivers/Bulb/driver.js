'use strict';

const constants = require('../../lib/telldus-api/constants');
const BaseDriver = require('../../lib/BaseDriver');

module.exports = class BulbDriver extends BaseDriver {

    getDeviceTypes() {
        return [constants.DEVICE_TYPES.bulb];
    }

    getMethods() {
        return [constants.commands.dim];
    }

    getDefaultCapabilities() {
        return ['dim'];
    }

};
