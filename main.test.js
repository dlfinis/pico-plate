const main = require('./main');
const inputData = require('./inputData');
// const jest = require('jest');

describe('main', () => {
   test('test base', () => {
      expect(true).toBe(true);
   });

   test('should show values for process', () => {
      inputData.getArgValues = jest.fn().mockReturnValue({ plate: 'GYU-1234', day: '2021-04-19', time: '12:30' });
      const data = main.process();
      console.log('data', data);
      expect(true).toBe(true);
      // main.inputData() = jest.fn().mockReturnValue(20);
   });
});