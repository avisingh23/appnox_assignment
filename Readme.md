# About
This is express typescript project to build APIs.

# Folders
- `bin`: This folder contains files that initiates api server or console app.
- `config`: This folder contains json configs related to the app. This is based on `config` npm package.
- `context`: This folder contains the base logic for create context for the app.
- `controllers`: This folder contains all the controllers and their interfaces.
- `crons`: This folder contains all the cron job definitions.
- `db`: This folder contains db connection script, db models and their interfaces. This folder can be expanded to support multiple databases.
- `error`: This folder contains classes for application level error.
- `helpers`: This folder contains utility classes.
- `interfaces`: This folder contains global interfaces.
- `lib`: This folder contains standard classes and libraries used across application.
- `middlewares`: This folder contains express middlewares.
- `routes`: This folder contains all the route definitions.
- `services`: This folder contains all the services.

# Config
Defines app configurations.
- `API_PREFIX`
- `PORT`
- `MONGODB_URI`
- `MONGODB_DEBUG`
- `AUTH_SECRET_KEY`: This is used to generate the jwt token.

Run `yarn build` or `npm run build` every time you change the config.

# NPM Packages Used
- express
- config
- joi
- bluebird
- lodash
- body-parser
- cors
- jsonwebtoken
- express-jwt
- express-status-monitor - try later
- mongoose
- luxon
- chai
- mocha
- reflect-metadata
- winston
- helmet
- compression
- eslint (dev)
- @typescript-eslint/eslint-plugin  (dev)
- @typescript-eslint/parser  (dev)
- eslint-config-airbnb-base (dev)
- eslint-config-prettier (dev)
- eslint-plugin-import (dev)
- eslint-plugin-prettier (dev)
- nodemon (dev)
- prettier (dev)
- shx (dev)
- ts-node (dev)
- typescript (dev)
- mime-types

Run `npm install` at the root of the project to install all the packages.

# Run the rabbitmq before running application
- `docker run --name rpc --rm -p 5677:5672 rabbitmq:3`

# RPC Server Integration Issues
- Multiple instances of same API server won't consume messages correctly.
- Multiple instances of Rpc Server should be working fine.

# Steps to setup development environment
1. Make sure you have installed `npm` and `nodejs`.
2. Install `MongoDB`.
3. Go the root directory of the project.
4. Run `npm install`.
5. Make config changes.
6. Run `npm run build` or `yarn build`. Run #6 every time you change config.
7. Run `npm run dev` or `yarn dev`.
8. Enjoy!

# Steps to setup MongoDB replication on local development environment
1. Stop mongo service. `service mongod stop` or as per your OS.
2. Create a folder mongo-data.
3. Create a folder mongo-data/replicaSetMember0.
4. Create a folder mongo-data/replicaSetMember1.
5. Create a folder mongo-data/replicaSetMember2.
6. Create a folder mongo-config.
7. Create a file replica-member-0.conf inside mongo-config and add below content.
```sh
# mongod -f replica-member-0.conf
replication:
    replSetName: rs0
    oplogSizeMB: 128
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod0.log"
   logAppend: true
storage:
   journal:
      enabled: true
net:
    bindIp: localhost,127.0.0.1
    port: 27017
storage:
    dbPath: <Member 0 data absolute path>
```
Replace systemLog.path with a log file path for member 0. Make sure that folder exists.
Replace storage.dbPath with absolute version of folder mongo-data/replicaSetMember0.
8. Create a file replica-member-1.conf inside mongo-config and add below content.
```sh
# mongod -f replica-member-0.conf
replication:
    replSetName: rs0
    oplogSizeMB: 128
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod1.log"
   logAppend: true
storage:
   journal:
      enabled: true
net:
    bindIp: localhost,127.0.0.1
    port: 27018
storage:
    dbPath: <Member 1 data absolute path>
```
Replace systemLog.path with a log file path for member 1. Make sure that folder exists.
Replace storage.dbPath with absolute version of folder mongo-data/replicaSetMember1.
9. Create a file replica-member-2.conf inside mongo-config and add below content.
```sh
# mongod -f replica-member-0.conf
replication:
    replSetName: rs0
    oplogSizeMB: 128
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod2.log"
   logAppend: true
storage:
   journal:
      enabled: true
net:
    bindIp: localhost,127.0.0.1
    port: 27019
storage:
    dbPath: <Member 2 data absolute path>
```
Replace systemLog.path with a log file path for member 2. Make sure that folder exists.
Replace storage.dbPath with absolute version of folder mongo-data/replicaSetMember2.
10. Open terminal and run below command
```sh
mongod --config <replica-member-0.conf absolute path> --fork
mongod --config <replica-member-1.conf absolute path> --fork
mongod --config <replica-member-2.conf absolute path> --fork
```
11. Run below commands
```sh
mongo
use admin
rsconf = {
  _id: "rs0",
  members: [
    {
     _id: 0,
     host: "127.0.0.1:27017"
    },
    {
     _id: 1,
     host: "127.0.0.1:27018"
    },
    {
     _id: 2,
     host: "127.0.0.1:27019"
    }
   ]
}
rs.initiate(rsconf)
rs.conf()
rs.status()
```
12. If step 1...11 ran correctly then mongo replica should be configured correctly.

# PM2
- @see https://pm2.keymetrics.io/docs/usage/application-declaration/
1. `pm2 start ecosystem.config.js`
2. `pm2 restart ecosystem.config.js`
3. `pm2 delete ecosystem.config.js` - Use this when you have modified ecosystem.config.js
4. `pm2 --help` - Check for more commands
5. `--env production` - Append this to run specific environment (production | staging | development)
6. `--only "AppOne,AppTwo"` - Append this to run specific apps

# Screen Command
1. `screen`
2. `Enter command to run`
3. `ctrl + a + d`
4. List screens `screen -ls`
5. Close screen
   1. `screen -r <id>`
   2. exit

# RUN-RS
- TRY [https://www.npmjs.com/package/run-rs]

# See
- https://typestrong.org/ts-node/docs/swc/