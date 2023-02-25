import { Router, Request, Response } from 'express';
import { asyncHandler, validateBasicAuth, validateUserAuthentication } from '../middlewares';
import { Context } from '../context';

function loadOrderRouter(ctx: Context) {
    const router = Router();
    router.post(
        '/:userId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.orderController?.checkout(req, res)),
    );
    router.get(
        '/:userId',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.orderController?.getOrders(req, res)),
    );

    return router;
}

export default loadOrderRouter;
