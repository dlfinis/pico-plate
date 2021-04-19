const main = require('./main')
if (env === 'prod') {
    console.log = function () {};
}
main.process();
