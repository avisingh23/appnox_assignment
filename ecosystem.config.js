module.exports = {
    apps: [
        {
            name: 'ApiServer',
            cwd: 'dist',
            script: 'index.js',
            exec_mode: 'cluster',
            instances: 4,
            env_production: {
                NODE_ENV: 'production',
            },
            env_staging: {
                NODE_ENV: 'staging',
            },
            env_development: {
                NODE_ENV: 'development',
            },
        },
        {
            name: 'RpcServer',
            cwd: 'dist',
            script: 'rpc.index.js',
            exec_mode: 'cluster',
            instances: 4,
            env_production: {
                NODE_ENV: 'production',
            },
            env_staging: {
                NODE_ENV: 'staging',
            },
            env_development: {
                NODE_ENV: 'development',
            },
        },
    ],
};
