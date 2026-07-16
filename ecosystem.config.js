const path = require('path');

const appDirectory = path.join(__dirname, 'apps', 'olive-rentals');

module.exports = {
  apps: [{
    name: 'olive-rentals',
    script: path.join(appDirectory, 'server.js'),
    cwd: appDirectory,
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    time: true,
    merge_logs: true,
    env: { NODE_ENV: 'development' },
    env_production: { NODE_ENV: 'production' }
  }]
};
