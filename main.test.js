const main = require('./main');
const inputData = require('./inputData');

describe('main', () => {
   test('test base', () => {
      expect(true).toBe(true);
   });

   test('should show values for process', () => {
      inputData.getArgValues = jest.fn().mockReturnValue({ plate: 'GYU-1234', day: '2021-04-19', time: '12:30' });
      const data = main.process();
      expect(data).not.toBeNull();
   });

   // test('should have a date with a defined time', () => {
   //    const currentDate = new Date();
   //    const dateProcess = main.getDateWithTimeRange(currentDate,'13:25');
   //    console.log('Date to process', currentDate);
   //    console.log('Date process', dateProcess);
   //    expect(dateProcess.getUTCHours()).toBe(13);
   // });

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

   test('should valid plate in the day', () => {
      const process = main.isPlateNumberBlock(new Date('2021-04-15'), 'GYU-1234');
      expect(process).toBe(true);
   });
   test('should not valid plate in the day', () => {
      const process = main.isPlateNumberBlock(new Date('2021-04-16'), 'GYU-1230');
      expect(process).toBe(false);
   });
});
