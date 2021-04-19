/**
 * Pico & Placa.
 * Vehicle control program for restrictions of Quito city.
 * Control without consideration of additional restrictions.
 */
'use strict';
const inputData = require('./inputData');
const constants = require('./constants');

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
    const day = dateProcess.getUTCDay();
    if (day && day == 6 || day == 0) {
        return true;
    } else {
        return false;
    }
}

function isPlateException(plate) {
    if (isValidValue(String, plate)) {
        const letters = plate.substring(0, plate.indexOf('-')+1).split();
        if (letters.length == 1) {
            return 'Not lock, diplomatic.'
        }
        if (['A', 'U', 'Z'].includes(letters[1])){
            return 'Not lock, public transportation.'
        }
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
        const day = dateProcess.getUTCDay() || dateProcess.getDay();

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
        dateMin = getDateWithTimeRange(dateProcess, constants.CONFIG.AFTERNOON_MIN);
        dateMax = getDateWithTimeRange(dateProcess, constants.CONFIG.AFTERNOON_MAX);
    } else {
        dateMin = getDateWithTimeRange(dateProcess, constants.CONFIG.MORNING_MIN);
        dateMax = getDateWithTimeRange(dateProcess, constants.CONFIG.MORNING_MAX);
    }

    console.log('isNotInTheTimeRangeBlock', 'origin', dateProcess, 'dateMin', dateMin, 'dateMax', dateMax,
        'result:', dateProcess.getTime() >= dateMin.getTime() && dateProcess.getTime() <= dateMax.getTime());
    if (dateProcess.getTime() >= dateMin.getTime() && dateProcess.getTime() <= dateMax.getTime()) {
        return false;
    } else {
        return true;
    }

}
function validateDataProcess() {
    
}

function validateDayDriving(dateProcess, plate) {
    if (isWeekend(dateProcess)) {
        return constants.MSG_VALID_WEEKEND;
    }

    if (isPlateNumberNotBlock(dateProcess, plate)) {
        return constants.MSG_VALID_DRIVING;
    }

    if (isNotInTheTimeRangeBlock(dateProcess)) {
        return constants.MSG_VALID_LOCKOUT_NOT_BLOCK;
    }

    return constants.MSG_NOT_VALID_TIME_BLOCK;
}

function processAsync() {
    return new Promise((resolve, reject) => {
        try {
            inputData.getArgValues().then(response => {
                console.info('Init process of validation', response);
                const dataProcess = response;
                const dateTimeToProcess = addTimeRange(new Date(dataProcess.day), dataProcess.time);
                const resultResponse = validateDayDriving(dateTimeToProcess, dataProcess.plate);
                console.info('Response:', resultResponse);
                return resolve(resultResponse);
            });
        } catch (err) {
            console.error('Error: process validation', err);
            reject(err);
        }
    });
}

module.exports = {
    processAsync,
    isValidValue,
    isPlateNumberNotBlock,
    getDateWithTimeRange,
    validateDayDriving,
    isNotInTheTimeRangeBlock,
    addTimeRange
};
