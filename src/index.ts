import { ApiApp } from './bin';

const app = new ApiApp({
    initRpcClient: false,
    initRpcServer: false,
});
app.bootstrap().then(() => {
    app.serve();
});
