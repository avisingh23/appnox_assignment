/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import { ICart } from '../interfaces';

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: String,
        },
        items: [
            {
                productId: {
                    type: String,
                },
                name: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity can not be less then 1.'],
                    default: 1,
                },
                price: Number,
            },
        ],
        bill: {
            type: Number,
            required: true,
            default: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        collection: 'cart',
    },
);

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;
    },
});

export const Cart = model<ICart>('item', cartSchema);
