import { Router, Request, Response } from 'express';
import { asyncHandler, validateRequestBody, validateBasicAuth, validateUserAuthentication } from '../middlewares';
import { Context } from '../context';
import { UserApiSchema } from '../controllers';

function loadUserRouter(ctx: Context) {
    const router = Router();
    router.post(
        '/login',
        validateBasicAuth(ctx),
        asyncHandler(validateRequestBody(UserApiSchema.Login)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.login(req, res)),
    );
    router.post(
        '/signup',
        validateBasicAuth(ctx),
        asyncHandler(validateRequestBody(UserApiSchema.Signup)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.signup(req, res)),
    );
    router.get(
        '/:userId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.getUserById(req, res)),
    );
    router.patch(
        '/:userId',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler(validateRequestBody(UserApiSchema.UpdateUserById)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.updateUserById(req, res)),
    );

    router.post(
        '/:userId/change-password',
        validateBasicAuth(ctx),
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler(validateRequestBody(UserApiSchema.ChangePassword)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.changePassword(req, res)),
    );
    router.get(
        '/',
        asyncHandler(validateUserAuthentication(ctx)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.getAllUsers(req, res)),
    );
    router.delete(
        '/:userId',
        asyncHandler((req: Request, res: Response) => ctx.controllers.userController?.deleteUserById(req, res)),
    );

    return router;
}

export default loadUserRouter;
