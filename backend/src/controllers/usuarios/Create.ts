import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';


interface User {
    id: string;
    name: string;
    email: string;
    senha: string;
}

export const create = async (req: Request<{}, {}, {} , {}, User>, res: Response) => {
    console.log(req.body)

    return res.send(StatusCodes.INTERNAL_SERVER_ERROR).send('Não Implementado');
};
