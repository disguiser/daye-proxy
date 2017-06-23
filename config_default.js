'use strict';

module.exports = {
    DB: {
        dialect: 'mssql',
        PJMAIN: 'PJMAIN',
        INTRUSTQLC: 'INTRUSTQLC',
        ENFOTA: 'ENFOTA',
        username: 'sa',
        password: '1qa@WS',
        // password: '000000',
        host: '192.168.1.118',
        // host: 'localhost',
        port: 1433
    },
    proxy: {
        proxy_port: '8000',
        target: [
            'http://192.168.1.118:8071/'
        ]
        // target: [
        //     'http://127.0.0.1:8071/'
        // ]
    },
    fileupload: {
        path: 'E:/audio/'
    },
    loggerStreams: [
        {
            level: 'debug',
            stream: process.stdout
        },
        {
            level: 'error',
            path: 'E:/64workspace/VS/daye/log/error.log'
        }
    ]
};