import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import * as validate from 'validate.js';

export default (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err: any = new Error();
        err.status = 422;
        err.errors = errors.array();
        return next(err);
    }
    next();
};

export const validateArrayElements = (itemConstraints: object, options?: validate.ValidateOption) => {
    return (arrayItems: any[]) => {
        const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
            const error = validate(item, itemConstraints, options);
            if (error) { errors[index] = { error }; }
            return errors;
        }, {});
        return Object.keys(arrayItemErrors).length === 0 ? null : { errors: arrayItemErrors };
    };
};
