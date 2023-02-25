import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares';
import { Context } from '../context';
import loadAdminUserRouter from './adminUser';
import loadUserRouter from './user.route';
import loadItemRouter from './item.route';
import loadCartRouter from './cart.route';
import loadOrderRouter from './order.route';

function loadRouter(ctx: Context) {
    const router = Router();
    router.get('/', (req: Request, res: Response) => {
        res.send('Hello Appnox');
    });

    router.post(
        '/create-auth-token',
        asyncHandler((req: Request, res: Response) => ctx.controllers.authController?.createToken(req, res)),
    );
    router.post(
        '/validate-auth-token',
        asyncHandler((req: Request, res: Response) => ctx.controllers.authController?.validateToken(req, res)),
    );

    router.use('/admin', loadAdminUserRouter(ctx));
    router.use('/user', loadUserRouter(ctx));
    router.use('/item', loadItemRouter(ctx));
    router.use('/cart', loadCartRouter(ctx));
    router.use('/order', loadOrderRouter(ctx));

    return router;
}

export default loadRouter;
