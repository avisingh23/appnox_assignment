import { Router, Request, Response } from 'express';
import { asyncHandler, validateRequestBody, validateBasicAuth } from '../middlewares';
import { Context } from '../context';
import { AdminLoginApiSchema } from '../controllers';

function loadAdminUserRouter(ctx: Context) {
    const router = Router();
    router.post(
        '/login',
        validateBasicAuth(ctx),
        asyncHandler(validateRequestBody(AdminLoginApiSchema.login)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.adminLoginController?.login(req, res)),
    );

    return router;
}

export default loadAdminUserRouter;
