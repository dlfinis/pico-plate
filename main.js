/**
 * Pico & Placa.
 * Vehicle control program.
 * Control without consideration of additional restrictions.
 */
'use strict';
const inputData = require('./inputData');

async function process() {
    console.log('Init process');
    const controlRestriction = new Map([
        [1, [0,1]],
        [2, [2,3]],
        [3, [4,5]],
        [4, [6,7]],
        [5, [8,9]],
    ]);

    const dataProcess = await inputData.getArgValues();

    console.log('Data to process', dataProcess, controlRestriction);

    const dataDay = new Date(dataProcess.day);
    const dataCheck = dataDay;
    const dataValid = dataDay;
    dataCheck.setUTCHours(dataProcess.time.substring(0,2),dataProcess.time.substring(3));
    console.log('Day', dataDay,dataProcess.time.substring(0,2),dataProcess.time.substring(3));
    return dataCheck;
}

module.exports = {process};
