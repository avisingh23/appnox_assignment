import { Request, Response } from 'express';
import { Model } from 'mongoose';
import Joi from 'joi';
import { ICart, IItem } from '../db/interfaces';
import { ILogger } from '../interfaces';
import { ICartController } from './controller.interface';
import { Errors, HttpException } from '../error';

interface CartControllerParams {
    cartRepository: Model<ICart>;
    itemRepository: Model<IItem>;
    logger: ILogger;
}

export const CartApiSchema = {
    postCart: Joi.object({
        productId: Joi.string().trim().normalize().required(),
        quantity: Joi.number().required(),
    }).required(),
};

export class CartController implements ICartController {
    cartRepository: Model<ICart>;
    itemRepository: Model<IItem>;
    logger: ILogger;

    constructor(params: CartControllerParams) {
        this.cartRepository = params.cartRepository;
        this.itemRepository = params.itemRepository;
        this.logger = params.logger;
    }

    async postCartItem(req: Request, res: Response): Promise<void> {
        const {
            body: { productId, quantity },
            params: { userId },
        } = req;
        let cart = await this.cartRepository.findOne({ userId });
        const item = await this.itemRepository.findOne({ _id: productId });
        if (!item) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        }
        if (item) {
            if (cart) {
                // if cart exists for the user
                const itemIndex = cart.items.findIndex((p) => p.productId === productId);

                // Check if product exists or not
                if (itemIndex > -1) {
                    const productItem = cart.items[itemIndex];
                    productItem.quantity += quantity;
                    cart.items[itemIndex] = productItem;
                } else {
                    cart.items.push({ productId, name: item.title, quantity, price: item.price });
                }
                cart.bill += quantity * item.price;
                cart = await cart.save();
                res.json(cart);
            }
            if (!cart) {
                const newCart = await this.cartRepository.create({
                    userId,
                    items: [{ productId, name: item.title, quantity, price: item.price }],
                    bill: quantity * item.price,
                });
                res.json(newCart);
            }
        }
    }

    async getCartItemsById(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const cart = await this.cartRepository.findOne({ userId });
        if (!cart) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        }
        if (cart && cart.items.length > 0) {
            res.json(cart);
        } else {
            res.json(null);
        }
    }

    async deleteCartItemById(req: Request, res: Response): Promise<Response> {
        const { userId, itemId } = req.params;

        const cart = await this.cartRepository.findOne({ userId });
        if (!cart) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        } else if (cart) {
            const itemIndex = cart.items.findIndex((p) => p.productId === itemId);
            if (itemIndex > -1) {
                const productItem = cart.items[itemIndex];
                cart.bill -= productItem.quantity * productItem.price;
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            return res.json(cart);
        }
        return res.json(cart);
    }
}
