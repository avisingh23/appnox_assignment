import { CustomValidator, CustomHelpers } from 'joi';
import { Types } from 'mongoose';

export const objectIdValidator: CustomValidator = (id: string, helper: CustomHelpers) => {
    if (Types.ObjectId.isValid(id)) {
        return id;
    }

    return helper.error('any.invalid');
};
