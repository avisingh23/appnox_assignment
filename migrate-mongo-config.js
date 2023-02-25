const path = require('path');

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'dist/config');

const configPackage = require('config');

global.config = configPackage;

const config = {
    mongodb: {
        url: configPackage.app.mongodb.uri,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: configPackage.app.mongodb.db,
        },
    },
    migrationsDir: 'migrations',
    changelogCollectionName: 'migrations',
    migrationFileExtension: '.js',
    useFileHash: false,
    moduleSystem: 'commonjs',
};

module.exports = config;
