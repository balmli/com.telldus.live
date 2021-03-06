'use strict';

const constants = require('../../lib/telldus-api/constants');
const BaseDriver = require('../../lib/BaseDriver');

module.exports = class SwitchDriver extends BaseDriver {

    getDeviceTypes() {
        return [constants.DEVICE_TYPES.switch];
    }

    getMethods() {
        return [constants.commands.on, constants.commands.off];
    }

    getDefaultCapabilities() {
        return ['onoff'];
    }

};
