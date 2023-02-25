import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IOrder extends IBaseModel {
    userId: String;
    items: [
        {
            productId: String;
            name: String;
            quantity: Number;
            price: Number;
        },
    ];
    bill: Number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
