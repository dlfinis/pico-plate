'use strict';
const constants = {
  MSG_VALID_WEEKEND: "There are no restrictions, is weekend",
  MSG_VALID_DRIVING: "Not exist lockout today.",
  MSG_VALID_NOT_LOCK: "Not lock, {0} plate.",
  MSG_NOT_VALID_TIME_BLOCK: "Lockout day, can't drive in the time indicated inside the city",
  MSG_VALID_LOCKOUT_NOT_BLOCK: "Lockout day, but you can drive between 09:31 and 15:59 inside the city",
  MSG_NOT_LOCKOUT_TIME: "There are no restrictions for the indicated time.",
  CONFIG: {
    MORNING_MIN: '07:00',
    MORNING_MAX: '09:30',
    AFTERNOON_MIN: '16:00',
    AFTERNOON_MAX: '19:30',
    PRIVATE_PLATE: 'PRIVATE',
    DIPLOMATIC_PLATE: ['CC', 'CD'],
    ORGANIZATION_PLATE: ['OI', 'AT', 'IT'],
    PUBLIC_TRANSPORTATION: ['A','U','Z'],
    STATE_TRANSPORTATION: ['E','M'],
  }
}

module.exports = Object.freeze(constants);
