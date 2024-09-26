import { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../dataSource';
import { User } from '../entity/User';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.role", "role")
        .where("user.username = :username", { username })
        .getOne();

    // Verificando se o usuário existe e a senha está correta
    if (user && bcrypt.compareSync(password, user.password)) {
        // Criação do token
        const token = jwt.sign({
            userId: user.id,
            userRole: user.role.name
        }, 'restaurante_no_fim_do_mundo', { expiresIn: '1h' });

        // Retornando o token e informações do usuário
        return res.status(StatusCodes.OK).json({
            data: {
                user: user.username,
                email: user.email, // Corrigido para acessar 'user.email'
                role: user.role.name, // Acesse o nome do papel
                jwt: token
            }
        });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json('Username or Password invalid');
    }
});


router.post('/logout', async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json('Logout realizado com sucesso')
});

export default router; 
