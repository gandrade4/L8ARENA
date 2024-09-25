import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken'

export function authenticateJWT (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers ['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json(' Token não encontrado ')
    }
}