'use strict';

const commands = {
    on: 0x0001, // 1
    off: 0x0002, // 2
    bell: 0x0004, // 4
    toggle: 0x0008, // 8
    dim: 0x0010, // 16
    learn: 0x0020, // 32
    execute: 0x0040, // 64
    up: 0x0080, // 128
    down: 0x0100, // 256
    stop: 0x0200, // 512
    rgb: 0x0400, // 1024
    thermostat: 0x0800, // 2048
};

const BATTERY_STATUS = {
    ok: 253,
    unknown: 254, //battery status unknown (not reported by this sensor type, or not decoded)
    low: 255
};

const DEVICE_TYPES = {
    device_alt: { description: 'Unknown_other', id: '00000000-0001-1000-2005-ACCA54000000' },
    alarm_sensor: { description: 'Alarm Sensor', id: '00000001-0001-1000-2005-ACCA54000000' },
    group: { description: 'Container', id: '00000002-0001-1000-2005-ACCA54000000' },
    location: { description: 'Controller', id: '00000003-0001-1000-2005-ACCA54000000' },
    doorclosed: { description: 'Door/Window', id: '00000004-0001-1000-2005-ACCA54000000' },
    bulb: { description: 'Light', id: '00000005-0001-1000-2005-ACCA54000000' },
    lock: { description: 'Lock', id: '00000006-0001-1000-2005-ACCA54000000' },
    music: { description: 'Media', id: '00000007-0001-1000-2005-ACCA54000000' },
    gauge: { description: 'Meter', id: '00000008-0001-1000-2005-ACCA54000000' },
    monitoring: { description: 'Motion', id: '00000009-0001-1000-2005-ACCA54000000' },
    on_off_sensor: { description: 'On/Off sensor', id: '0000000A-0001-1000-2005-ACCA54000000' },
    user: { description: 'Person', id: '0000000B-0001-1000-2005-ACCA54000000' },
    remotecontrol: { description: 'Remote control', id: '0000000C-0001-1000-2005-ACCA54000000' },
    sensor: { description: 'Sensor', id: '0000000D-0001-1000-2005-ACCA54000000' },
    smoke_sensor: { description: 'Smoke sensor', id: '0000000E-0001-1000-2005-ACCA54000000' },
    speaker: { description: 'Speaker', id: '0000000F-0001-1000-2005-ACCA54000000' },
    switch: { description: 'Switch/Outlet:', id: '00000010-0001-1000-2005-ACCA54000000' },
    thermostat: { description: 'Thermostat:', id: '00000011-0001-1000-2005-ACCA54000000' },
    buttononoff: { description: 'Virtual:', id: '00000012-0001-1000-2005-ACCA54000000' },
    window_covering: { description: 'Window covering:', id: '00000013-0001-1000-2005-ACCA54000000' },
    projector_screen: { description: 'Projector screen:', id: '00000014-0001-1000-2005-ACCA54000000' }
}

let DEVICE_TYPES_INVERTED = {};
for (const [key, value] of Object.entries(DEVICE_TYPES)) {
    DEVICE_TYPES_INVERTED[value.id] = { device: key, description: value.description };
}

module.exports = {
    commands: commands,
    DEVICE_TYPES: DEVICE_TYPES,
    DEVICE_TYPES_INVERTED: DEVICE_TYPES_INVERTED,
    BATTERY_STATUS: BATTERY_STATUS
};
