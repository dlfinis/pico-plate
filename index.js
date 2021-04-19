const environment = process.env.NODE_ENV || 'dev';
const main = require('./main')

if (environment === 'prod') {
    console.log = function () {};
}

main.processAsync();
