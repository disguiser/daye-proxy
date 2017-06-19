module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'node-proxy',
      script    : 'start.js',
      watch: true,
      instances: 1,
      ignore_watch: ['ecosystem.config.js', '.gitignore', '.git', 'node_modules', 'public', 'test', 'log'],
      error_file: './log/pm2-err.log',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      },
      exec_mode: 'fork'
    }
  ]
};
