/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import { IItem } from '../interfaces';

const itemSchema = new Schema<IItem>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
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
        collection: 'items',
    },
);

itemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

itemSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;
    },
});

export const Item = model<IItem>('items', itemSchema);
