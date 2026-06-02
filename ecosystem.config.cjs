module.exports = {
    apps: [
        {
            name: 'herbgarden',
            script: 'server.js',
            interpreter: 'node',
            cwd: '/var/www/herbgarden',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3004,
                HOSTNAME: '127.0.0.1',
                // Still good to keep these for safety
                NODE_OPTIONS: '--max-old-space-size=2048 --no-deprecation',
            },
            error_file: './logs/error.log',
            out_file: './logs/output.log',
            merge_logs: true,
            time: true,
            autorestart: true,
            watch: false,
            max_memory_restart: '2G',
            kill_timeout: 3000,
        },
    ],
}