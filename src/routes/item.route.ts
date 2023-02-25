import { Router, Request, Response } from 'express';
import { asyncHandler, validateRequestBody, validateBasicAuth, validateUserAuthentication } from '../middlewares';
import { Context } from '../context';
import { ItemApiSchema } from '../controllers';

function loadItemRouter(ctx: Context) {
    const router = Router();
    router.post(
        '/',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler(validateRequestBody(ItemApiSchema.postItem)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.itemController?.postItem(req, res)),
    );
    router.get(
        '/',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.itemController?.getItems(req, res)),
    );
    router.get(
        '/:itemId',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.itemController?.getItemById(req, res)),
    );
    router.patch(
        '/:itemId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler(validateRequestBody(ItemApiSchema.updateItem)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.itemController?.updateItemById(req, res)),
    );
    router.delete(
        '/:itemId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.itemController?.deleteItemById(req, res)),
    );

    return router;
}

export default loadItemRouter;
