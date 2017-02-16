'use strict';

module.exports = {
    DB: {
        dialect: 'mssql',
        database: 'PJMAIN',
        username: 'sa',
        password: '1qa@WS',
        // password: '000000',
        host: '192.168.1.32',
        // host: 'localhost',
        port: 1433
    },
    proxy: {
        proxy_port: '8000',
        // target: 'http://192.168.1.32:8071/'
        target: 'http://127.0.0.1:8071/'
    },
    fileupload: {
        path: 'E:/audio/'
    }
};