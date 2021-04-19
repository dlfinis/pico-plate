/**
 * Pico & Placa.
 * Vehicle control program for restrictions of Quito city.
 * Control without consideration of additional restrictions.
 */
'use strict';
const inputData = require('./inputData');
const constants = require('./constants');

function isValidValue(typeData, value) {
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

function getPlateException(plate) {
    const contentLetters = plate.substring(0, plate.indexOf('-'));
    const letters = contentLetters.split('');

    if (constants.CONFIG.DIPLOMATIC_PLATE.includes(contentLetters)) {
        return constants.MSG_VALID_NOT_LOCK.replace('{0}', 'it is a diplomatic');
    }
    if (constants.CONFIG.ORGANIZATION_PLATE.includes(contentLetters)) {
        return constants.MSG_VALID_NOT_LOCK.replace('{0}', 'it is an organization international');
    }
    if (constants.CONFIG.STATE_TRANSPORTATION.includes(letters[1])) {
        return constants.MSG_VALID_NOT_LOCK.replace('{0}', 'it is a state');
    }
    if (constants.CONFIG.PUBLIC_TRANSPORTATION.includes(letters[1])) {
        return constants.MSG_VALID_NOT_LOCK.replace('{0}', 'it is a public transportation');
    }

    return constants.CONFIG.PRIVATE_PLATE;
}

function isWeekend(dateProcess) {
    const day = dateProcess.getUTCDay();
    return day === 6 || day === 0;
}

function isPlateNumberNotBlock(dateProcess, plate) {
    const controlRestriction = new Map([
        [1, [1, 2]],
        [2, [3, 4]],
        [3, [5, 6]],
        [4, [7, 8]],
        [5, [9, 0]],
    ]);
    const stringLength = plate.length;
    const lastDigit = Number.parseInt(plate.charAt(stringLength - 1));
    const day = dateProcess.getUTCDay() || dateProcess.getDay();

    const dayControl = controlRestriction.get(day) || [];
    const existBlock = dayControl.some(item => item === lastDigit);
    console.log('day number:', day, 'lastDigit: ', lastDigit, 'dayControl:', dayControl, 'existblock:', existBlock);
    return !(dayControl && existBlock);
}

//  7:00am - 9:30am / 16:00pm - 19:30
function isNotInTheTimeRangeBlock(dateProcess) {
    let dateMin;
    let dateMax;
    if (dateProcess.getUTCHours() >= 13) {
        dateMin = getDateWithTimeRange(dateProcess, constants.CONFIG.AFTERNOON_MIN);
        dateMax = getDateWithTimeRange(dateProcess, constants.CONFIG.AFTERNOON_MAX);
    } else {
        dateMin = getDateWithTimeRange(dateProcess, constants.CONFIG.MORNING_MIN);
        dateMax = getDateWithTimeRange(dateProcess, constants.CONFIG.MORNING_MAX);
    }

    console.log('isNotInTheTimeRangeBlock', 'origin', dateProcess, 'dateMin', dateMin, 'dateMax', dateMax);
    return !(dateProcess.getTime() >= dateMin.getTime() && dateProcess.getTime() <= dateMax.getTime());
}

function isOutTimeRangeBlock(dateProcess) {
    const dateMin = getDateWithTimeRange(dateProcess, constants.CONFIG.MORNING_MIN);
    const dateMax = getDateWithTimeRange(dateProcess, constants.CONFIG.AFTERNOON_MAX);
    return dateProcess.getTime() < dateMin.getTime() || dateProcess.getTime() > dateMax.getTime();
}

function validateDataProcess(dateProcess, plate, timeRange) {
    return isValidValue(Date, dateProcess) && isValidValue(String, plate) && isValidValue(String, timeRange);
}

function validateDayDriving(dateProcess, plate) {

    if (isWeekend(dateProcess)) {
        return constants.MSG_VALID_WEEKEND;
    }

    if (isOutTimeRangeBlock(dateProcess)) {
        return constants.MSG_NOT_LOCKOUT_TIME;
    }

    const plateException = getPlateException(plate);
    if (plateException !== constants.CONFIG.PRIVATE_PLATE) {
        return plateException;
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
            let resultResponse = 'Not process validation';
            inputData.getArgValues().then(response => {
                console.info('Init process of validation', response);
                const dataProcess = response;
                const dateValue = new Date(dataProcess.day);
                if (validateDataProcess(dateValue, dataProcess.plate, dataProcess.time)) {
                    const dateTimeToProcess = addTimeRange(dateValue, dataProcess.time);
                    resultResponse = validateDayDriving(dateTimeToProcess, dataProcess.plate);
                }
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
    addTimeRange,
    getDateWithTimeRange,
    getPlateException,
    isValidValue,
    isPlateNumberNotBlock,
    isNotInTheTimeRangeBlock,
    validateDayDriving,
};
