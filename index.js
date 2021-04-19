const main = require('./main')
const environment = process.env.NODE_ENV || 'dev';
if (environment === 'prod') {
    console.log = function () {};
}
main.processAsync();
