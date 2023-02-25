import { RpcApp } from './bin';

const app = new RpcApp();
app.bootstrap().then(() => {
    app.serve();
});
