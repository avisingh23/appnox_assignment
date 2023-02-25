import { Request, Response } from 'express';

export interface IController {}

export interface IAuthController extends IController {
    createToken(req: Request, res: Response): Promise<Response>;
    validateToken(req: Request, res: Response): Promise<Response>;
}

export interface IAdminLoginController extends IController {
    login(req: Request, res: Response): Promise<Response>;
}

export interface IUserController extends IController {
    login(req: Request, res: Response): Promise<Response>;
    signup(req: Request, res: Response): Promise<Response>;
    getUserById(req: Request, res: Response): Promise<Response>;
    updateUserById(req: Request, res: Response): Promise<Response>;
    changePassword(req: Request, res: Response): Promise<Response>;
    getAllUsers(req: Request, res: Response): Promise<Response>;
    deleteUserById(req: Request, res: Response): Promise<Response>;
}

export interface IItemController extends IController {
    postItem(req: Request, res: Response): Promise<Response>;
    getItems(req: Request, res: Response): Promise<Response>;
    getItemById(req: Request, res: Response): Promise<Response>;
    updateItemById(req: Request, res: Response): Promise<Response>;
    deleteItemById(req: Request, res: Response): Promise<Response>;
}
export interface ICartController extends IController {
    postCartItem(req: Request, res: Response): Promise<void>;
    getCartItemsById(req: Request, res: Response): Promise<void>;
    deleteCartItemById(req: Request, res: Response): Promise<Response>;
}
export interface IOrderController extends IController {
    checkout(req: Request, res: Response): Promise<void>;
    getOrders(req: Request, res: Response): Promise<Response>;
}
