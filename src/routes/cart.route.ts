import { Router, Request, Response } from 'express';
import { asyncHandler, validateRequestBody, validateBasicAuth, validateUserAuthentication } from '../middlewares';
import { Context } from '../context';
import { CartApiSchema } from '../controllers';

function loadCartRouter(ctx: Context) {
    const router = Router();
    router.post(
        '/:userId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler(validateRequestBody(CartApiSchema.postCart)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.cartController?.postCartItem(req, res)),
    );
    router.get(
        '/:userId',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.cartController?.getCartItemsById(req, res)),
    );
    router.delete(
        '/:userId/:itemId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.cartController?.deleteCartItemById(req, res)),
    );

    return router;
}

export default loadCartRouter;
