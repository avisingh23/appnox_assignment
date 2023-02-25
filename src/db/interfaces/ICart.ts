import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface ICart extends IBaseModel {
    userId: String;
    items: [
        {
            productId: String;
            name: String;
            quantity: number;
            price: number;
        },
    ];
    bill: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
