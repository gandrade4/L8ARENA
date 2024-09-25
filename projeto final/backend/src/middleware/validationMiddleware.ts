import { Request, Response, NextFunction } from "express";
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';

const userSchema = yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    username: yup.string().required().min(3),
    password: yup.string().required().min(8),
    role: yup.string().optional(),
});

const courtSchema = yup.object().shape({
    name: yup.string().required().min(3),
    type: yup.string().oneOf(['Futevolei', 'Beach Tennis']).required(),
    isAvailable: yup.boolean().required().default(true)
})

export const validateUserBody = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userSchema.validate(req.body, { abortEarly: false});
        next();
    } catch (err: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.errors});
    }
};

export const validateCourtBody = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await courtSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.errors});
    }
};