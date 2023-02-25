import { connect, ConnectOptions, Model, mongo, Mongoose } from 'mongoose';
import { Permission, Role, User, Cart, Order, Item } from './models';

interface DBConnectionParams {
    uri: string;
    options?: ConnectOptions;
}

export class DBConnection {
    mongoose: Mongoose;
    params: DBConnectionParams;
    repository: { [key: string]: Model<any, {}> } = {};
    gfs: any;

    constructor(params: DBConnectionParams) {
        this.params = params;
    }

    async connect(debug: boolean = false) {
        this.mongoose = await connect(this.params.uri, this.params.options);
        // set debugging
        this.mongoose.set('debug', debug);
        this.mongoose.connection.on('error', (err: any) => {
            // eslint-disable-next-line no-console
            console.log(err);
        });
        this.mongoose.connection.on('disconnected', () => {
            // eslint-disable-next-line no-console
            console.log('disconnected mongodb');
        });
        this.mongoose.connection.on('reconnected', () => {
            // eslint-disable-next-line no-console
            console.log('reconnected mongodb');
        });
        // eslint-disable-next-line no-console
        console.log('db connection success');
    }

    async registerCollections() {
        this.repository.role = Role;
        this.repository.permission = Permission;
        this.repository.user = User;
        this.repository.item = Item;
        this.repository.cart = Cart;
        this.repository.order = Order;

        this.gfs = new mongo.GridFSBucket(this.mongoose.connection.db, {
            chunkSizeBytes: 1024,
            bucketName: 'images',
        });
    }

    async disconnect(): Promise<void> {
        // eslint-disable-next-line no-console
        console.log('closing db connection');
        await this.mongoose.connection.close();
        // eslint-disable-next-line no-console
        console.log('db connection closed');
    }
}
