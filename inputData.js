const prompt = require('prompt');

function pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}
function getArgValues() {
    const currentDate = new Date();
    prompt.start();

// define properties schema
    var schema = {
        properties: {
            plate: {
                description: 'Input a plate (AAA-####)',
                default: 'GYU-1234',
                pattern: /^[a-zA-Z]{3}-[1-9]{3,4}|^[a-zA-Z]{3}-[1-9]{1}[0-9]{2,3}|^[a-zA-Z]{2}-[0-9]{3,4}$/,
                message: '2 or 3 letters one dash 3 or 4 digits',
                required: true,
                before: function(value) { return value.toUpperCase(); }
            },
            day: {
                description: 'Input a day (yyy-mm-dd)',
                default: currentDate.getFullYear() + '-' + pad(currentDate.getMonth() + 1) + '-' + pad(currentDate.getDate()),
                pattern: /^(2)\d{3}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])\d$/,
                message: 'format yyy-mm-dd',
                required: true
            },
            time: {
                description: 'Input a time, HH:MM 24-hour with leading 0',
                default: pad(currentDate.getHours()) + ":" + pad(currentDate.getMinutes()),
                pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                message: 'format hh:mm',
                required: true
            },
        }
    };

    return prompt.get(schema);
}

module.exports = {getArgValues};
