module.exports = {
  "apps": [
    {
      "name": "herbgarden",
      "cwd": "/var/www/herbgarden-runtime/current",
      "script": "server.js",
      "interpreter": "/usr/bin/node",
      "node_args": "--env-file=/var/www/herbgarden-runtime/shared/.env",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production",
        "HOSTNAME": "127.0.0.1",
        "PORT": 3004,
        "NODE_OPTIONS": "--no-deprecation --max-old-space-size=768"
      },
      "error_file": "/var/www/herbgarden-runtime/logs/error.log",
      "out_file": "/var/www/herbgarden-runtime/logs/output.log",
      "merge_logs": true,
      "time": true,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1024M",
      "kill_timeout": 10000,
      "min_uptime": "10s",
      "max_restarts": 10,
      "exp_backoff_restart_delay": 1000
    }
  ]
}
