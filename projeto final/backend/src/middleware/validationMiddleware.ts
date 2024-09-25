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

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userSchema.validate(req.body, { abortEarly: false});
        next();
    } catch (err: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.errors});
    }
};