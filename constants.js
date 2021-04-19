'use strict';
const constants = {
  MSG_VALID_WEEKEND: "Valid, is weekend",
  MSG_VALID_DRIVING: "Not lock today.",
  MSG_NOT_VALID_TIME_BLOCK: "Lockout day, can't drive in the time range indicated",
  MSG_VALID_LOCKOUT_NOT_BLOCK: "Lockout day, but you can drive in the time range indicated",
  CONFIG: {
    MORNING_MIN: '07:00',
    MORNING_MAX: '09:30',
    AFTERNOON_MIN: '16:00',
    AFTERNOON_MAX: '19:30'
  }
}

module.exports = Object.freeze(constants);
