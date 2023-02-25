/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import { IOrder } from '../interfaces';

const orderSchema = new Schema<IOrder>(
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
                },
                price: Number,
            },
        ],
        bill: {
            type: Number,
            required: true,
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
        collection: 'order',
    },
);

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;
    },
});

export const Order = model<IOrder>('order', orderSchema);
