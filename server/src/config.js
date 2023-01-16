const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env' });

module.exports = {
    mongoPass: process.env.MONGO_PASS
}