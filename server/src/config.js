const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env' });

module.exports = {
    mongoPath: process.env.MONGO_PATH,
    port: process.env.PORT || 8000
}