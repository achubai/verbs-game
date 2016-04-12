/**
 * Created by achubai on 4/8/2016.
 */

var config = {
    SECRET: 'secret'
};

if (process.env.NODE_ENV === 'production') {
    config.DB_PATH = 'mongodb://admin:mbrmL7VVPrBD@127.11.199.130:27017/test';
    config.PORT = process.env.NODE_PORT;
    config.IP = process.env.NODE_IP
} else {
    config.DB_PATH = 'mongodb://localhost/verbs';
    config.PORT = 9000;
    config.IP = '';
}

module.exports = config;