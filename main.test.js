const main = require('./main');
const inputData = require('./inputData');
const constants = require('./constants');

describe('main', () => {
    test('test base', () => {
        expect(true).toBe(true);
    });

    test('should show values for process', () => {
        inputData.getArgValues = jest.fn().mockReturnValue(new Promise(resolve => resolve({
            plate: 'GYU-1234',
            day: '2021-04-19',
            time: '12:30'
        })));

        inputData.getArgValues().then(response => {
            expect(response).not.toBeNull();
        })
    });

    test('should have a date with a defined time', () => {
        const currentDate = new Date();
        const dateProcess = main.getDateWithTimeRange(currentDate, '13:25');
        console.log('Date to process', currentDate);
        console.log('Date process', dateProcess);
        expect(dateProcess.getUTCHours()).toBe(13);
    });

    test('should valid if is a Date', () => {
        const currentDate = new Date();
        console.log('typeof Date', typeof currentDate);
        console.log('instanceof Date', currentDate instanceof Date);
        const validValue = main.isValidValue(Date, currentDate);
        expect(validValue).toBe(true);
    });

    test('should valid value if is a string', () => {
        const value = 'dataString'
        console.log('typeof String', typeof String);
        console.log('typeof String', typeof value);
        console.log('instanceof String', value instanceof String);
        const validValue = main.isValidValue(String, value);
        expect(validValue).toBe(true);
    });

    test('should show block for driving respect the time of the day', () => {
        const dateProcess = main.getDateWithTimeRange(new Date(), '18:51');
        const process = main.isNotInTheTimeRangeBlock(dateProcess);
        expect(process).toBe(false);
    });

    test('should valid plate private', () => {
        const process = main.getPlateException('GYU-1234');
        expect(process).toBe(constants.CONFIG.PRIVATE_PLATE);
    });

    test('should get exception of international plate', () => {
        const processMessage = main.getPlateException('IT-1234');
        console.log('Type plate', processMessage);
        expect(processMessage).not.toBeNull();
    });

    test('should valid plate in the day', () => {
        const process = main.isPlateNumberNotBlock(new Date('2021-04-15'), 'GYU-1234');
        expect(process).toBe(true);
    });

    test('should valid plate and day for driving not block', () => {
        const process = main.validateDayDriving(main.addTimeRange(new Date('2021-04-15'), '18:51'), 'GYU-1234');
        expect(process).toBe(constants.MSG_VALID_DRIVING);
    });

    test('should block by the plate and daytime', () => {
        const dateBase = new Date('2021-04-16');
        const dateToProcess = main.addTimeRange(dateBase, '18:51');
        console.log('DateToProcess', dateBase, dateToProcess, dateToProcess.getUTCHours(), dateToProcess.getDay());
        const process = main.validateDayDriving(dateToProcess, 'GYU-1239');
        expect(process).toBe(constants.MSG_NOT_VALID_TIME_BLOCK);
    });

    test('should not block by plate type public', () => {
        inputData.getArgValues = jest.fn().mockReturnValue(new Promise(resolve => resolve({
            plate: 'TAE-1234',
            day: '2021-04-21',
            time: '12:30'
        })));
        return main.processAsync().then(response => {
            expect(response).toBe(constants.MSG_VALID_NOT_LOCK.replace('{0}', 'it is a public transportation'));
        });
    });

    test('should not block by day is weekend', () => {
        inputData.getArgValues = jest.fn().mockReturnValue(new Promise(resolve => resolve({
            plate: 'GYU-123',
            day: '2021-04-17',
            time: '12:30'
        })));
        return main.processAsync().then(response => {
            expect(response).toBe(constants.MSG_VALID_WEEKEND);
        });
    });

    test('should not block by day', () => {
        inputData.getArgValues = jest.fn().mockReturnValue(new Promise(resolve => resolve({
            plate: 'GYU-1234',
            day: '2021-04-21',
            time: '12:30'
        })));
        return main.processAsync().then(response => {
            expect(response).toBe(constants.MSG_VALID_DRIVING);
        });
    });

    test('should not block by time', () => {
        inputData.getArgValues = jest.fn().mockReturnValue(new Promise(resolve => resolve({
            plate: 'GYU-1234',
            day: '2021-04-20',
            time: '12:30'
        })));
        return main.processAsync().then(response => {
            expect(response).toBe(constants.MSG_VALID_LOCKOUT_NOT_BLOCK);
        });
    });
    test('should block by day, plate and time', () => {
        inputData.getArgValues = jest.fn().mockReturnValue(new Promise(resolve => resolve({
            plate: 'GYU-124',
            day: '2021-04-20',
            time: '09:30'
        })));
        return main.processAsync().then(response => {
            expect(response).toBe(constants.MSG_NOT_VALID_TIME_BLOCK);
        });
    });
});
