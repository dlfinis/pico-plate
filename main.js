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

function addTimeRange(dateProcess, timeRange) {
    if (!isValidValue(Date, dateProcess) || !isValidValue(String, timeRange)) {
        throw new Error('Error to add time range to date', dateProcess, timeRange);
    }
    dateProcess.setUTCHours(timeRange.substring(0, 2), timeRange.substring(3));
    return dateProcess;
}

function getDateWithTimeRange(dateProcess, timeRange) {
    if (!isValidValue(Date, dateProcess) || !isValidValue(String, timeRange)) {
        throw new Error('Error to add time range to date', dateProcess, timeRange);
    }
    const dateSet = new Date(dateProcess.getTime());
    dateSet.setUTCHours(timeRange.substring(0, 2), timeRange.substring(3));
    return dateSet;
}

function isWeekend(dateProcess) {
    if (!isValidValue(Date, dateProcess)) {
        throw new Error('Error to check is weekend day', dateProcess);
    }
    const day = dateProcess.getDay();
    if (day && day == 6 || day == 0) {
        return true;
    } else {
        return false;
    }
}

function isPlateNumberNotBlock(dateProcess, plate) {
    const controlRestriction = new Map([
        [1, [1, 2]],
        [2, [3, 4]],
        [3, [5, 6]],
        [4, [7, 8]],
        [5, [9, 0]],
    ]);
    if (isValidValue(Date, dateProcess) && isValidValue(String, plate)) {
        const stringLength = plate.length;
        const lastDigit = Number.parseInt(plate.charAt(stringLength - 1));
        const day = dateProcess.getDay();

        const dayControl = controlRestriction.get(day) || [];
        const existBlock = dayControl.some(item => item == lastDigit);
        console.log('day number:', day, 'lastDigit: ', lastDigit, 'dayControl:', dayControl, 'existblock:', existBlock);
        if (dayControl && existBlock) {
            return false;
        } else {
            return true;
        }

    }
}

function isNotInTheTimeRangeBlock(dateProcess) {
    // 6:30 a.m. a 10:00 a.m. y de 5:00 p.m. a 9:00 p.m
    if (!isValidValue(Date, dateProcess)) {
        throw new Error('Not valid dateProcess for validTime');
    }

    let dateMin = new Date();
    let dateMax = new Date();
    if (dateProcess.getUTCHours() >= 13) {
        dateMin = getDateWithTimeRange(dateProcess, '17:00');
        dateMax = getDateWithTimeRange(dateProcess, '19:00');
    } else {
        dateMin = getDateWithTimeRange(dateProcess, '06:30');
        dateMax = getDateWithTimeRange(dateProcess, '10:00');
    }

    console.log('isNotInTheTimeRangeBlock', 'origin', dateProcess, 'dateMin', dateMin, 'dateMax', dateMax);
    if (dateMin.getTime() >= dateProcess.getTime() || dateProcess.getTime() <= dateMax.getTime()) {
        return false;
    } else {
        return true;
    }

}

function validateDayDriving(dateProcess, plate) {
    if (isWeekend(dateProcess)) {
        return 'Valid, is weekend';
    }

    if (isPlateNumberNotBlock(dateProcess, plate)) {
        return 'Driving day, valid';
    }

    if (isNotInTheTimeRangeBlock(dateProcess)) {
        return "Lockout day, but can drive in this moment";
    }

    return "Lockout, can't drive in this moment";
}

async function process() {
    console.log('Init process');


    const dataProcess = await inputData.getArgValues();

    const dateTimeToProcess = addTimeRange(new Date(dataProcess.day), dataProcess.time);
    return validateDayDriving(dateTimeToProcess, dataProcess.plate);
}

module.exports = {
    process, isValidValue, isPlateNumberNotBlock, getDateWithTimeRange, validateDayDriving, isNotInTheTimeRangeBlock,
    addTimeRange
};
