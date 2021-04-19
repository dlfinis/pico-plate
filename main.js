/**
 * Pico & Placa.
 * Vehicle control program.
 * Control without consideration of additional restrictions.
 */
'use strict';
const inputData = require('./inputData');

function isValidValue(typeData, value) {
    // console.log('isValidValue', typeData, value);
    if (typeof typeData !== 'function') {
        throw new Error('Not valid class of data type', typeData);
    }
    if (typeof value == 'undefined' || value == null || !value instanceof typeData) {
        throw new Error('Not valid value', typeData, value);
    } else {
        return true;
    }
}

function getDateWithTimeRange(dateProcess, timeRange) {
    if (isValidValue('Date', dateProcess)) {
        throw new Error('Not valid dateProcess');
    }
    if (isValidValue('string', timeRange)) {
        throw new Error('Not valid timeRange');
    }

    let dateSet = new Date();
    Object.assign(dateSet, dateProcess);
    dateSet.setUTCHours(timeRange.substring(0, 2), timeRange.substring(3));
    return dateSet;
}

function isWeekend(dateProcess) {
    const day = dateProcess.getDay();
    if (day && day == 5 || day == 6) {
        return true;
    } else {
        return false;
    }
}

function isPlateNumberNotBlock(dateProcess, plate) {
    const controlRestriction = new Map([
        [0, [1, 2]],
        [1, [3, 4]],
        [2, [5, 6]],
        [3, [7, 8]],
        [4, [9, 0]],
    ]);
    if (isValidValue(Date, dateProcess) && isValidValue(String, plate)) {
        const stringLength = plate.length;
        const lastDigit = Number.parseInt(plate.charAt(stringLength - 1));
        const day = dateProcess.getDay();

        const dayControl = controlRestriction.get(day) || [];
        const existBlock = dayControl.some(item => item == lastDigit);
        console.log('day number:',day,'lastDigit: ', lastDigit, 'dayControl:', dayControl, 'existblock:', existBlock);
        if (dayControl && existBlock) {
            return false;
        } else {
            return true;
        }

    }
}

function validDate(dateProcess, timeRangeMin, timeRangeMax) {
    // 6:30 a.m. a 10:00 a.m. y de 5:00 p.m. a 9:00 p.m
    if (isValidValue(Date, dateProcess)) {
        throw new Error('Not valid dateProcess');
    }

    if (dateProcess.getUTCHours() > 12) {
        getDateWithTimeRange(currentDate,)
    }
    const dateMin = dateProcess;

}

function validatePlate(dateProcess) {
    if (isValidValue(Date, dateProcess)) {
        throw new Error('Not valid dateProcess');
    }

    if (isWeekend(dateProcess)) {
        return 'Valid, is weekend';
    }

    if (isPlateNumberNotBlock(dateProcess)) {
        return 'Valid, not exist block for driving';
    }
}

async function process() {
    console.log('Init process');


    const dataProcess = await inputData.getArgValues();

    const dataDay = new Date(dataProcess.day);
    const dataCheck = dataDay;
    const dataValid = dataDay;
    dataCheck.setUTCHours(dataProcess.time.substring(0, 2), dataProcess.time.substring(3));
    console.log('Day', dataDay, dataProcess.time.substring(0, 2), dataProcess.time.substring(3));
    return dataCheck;
}

module.exports = {process, isValidValue, isPlateNumberBlock: isPlateNumberNotBlock, getDateWithTimeRange, validatePlate};
