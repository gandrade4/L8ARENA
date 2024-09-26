import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken'

interface CustomizedRequest extends Request {
    user: any,
}

export function authenticateJWT (req: CustomizedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers ['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json( 'Token não encontrado' )
    }

    try {
        const verified = jwt.verify(token, 'restaurante_no_fim_do_mundo')
        req.user = verified
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json( 'Token inválido' )
    }
}