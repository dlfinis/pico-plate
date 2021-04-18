/**
 * Pico & Placa.
 * Vehicle control program.
 * Control without consideration of additional restrictions.
 */
'use strict';
const prompt = require('prompt');

function inputData() {
    const currentDate = new Date();
    prompt.start();

// define properties schema
    var schema = {
        properties: {
            plate: {
                description: 'Input a plate (AAA-####)',
                default: 'GYU-1234',
                pattern: /^[A-Z]{3}-[1-9]{3,4}|^[A-Z]{1}[1-9]{1}[A-Z]{1}-[1-9]{3}|^[1-9]{4}-[A-Z,1-9]{2}|^[A-Z]{2}-[1-9]{4}$/,
                message: '3 letters one dash 3 or 4 digits',
                required: true
            },
            day: {
                description: 'Input a day (yyy-mm-dd)',
                default: currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' +currentDate.getDate(),
                pattern: /^(2)\d{3}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])\d$/,
                message: 'format yyy-mm-dd',
                required: true
            },
            time: {
                description: 'Input a time, HH:MM 24-hour with leading 0',
                default: currentDate.getHours() + ":" + currentDate.getMinutes(),
                pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                message: 'format hh:mm',
                required: true
            },
        }
    };

    return prompt.get(schema);

}

async function main() {
    console.log('Init process');
    const controlRestriction = new Map([
        [1, [0,1]],
        [2, [2,3]],
        [3, [4,5]],
        [4, [6,7]],
        [5, [8,9]],
    ]);

    const dataProcess = await inputData();

    console.log('Data to process', dataProcess, controlRestriction);

    const dataDay = new Date(dataProcess.day);
    const dataCheck = dataDay;
    const dataValid = dataDay;
    dataCheck.setUTCHours(dataProcess.time.substring(0,2),dataProcess.time.substring(3));
    console.log('Day', dataDay,dataProcess.time.substring(0,2),dataProcess.time.substring(3));
}

main();
module.exports = main;