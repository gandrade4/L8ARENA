import { Request, Response } from  'express';
import fs from 'fs/promises';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

interface User {
    id: number,
    name: string,
    username: string,
    email: string,
    password: string,
    role?: string;
}

const dataPath = path.join(__dirname, '../database/users.json');

const readUsers = async () => {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
};

const writeUsers = async (users: User[]) => {
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
};

//Listar usuários
export const getAllUsers = async (req: Request, res: Response) => {
    const users = await readUsers(); // Lendo a array de usuários
    return res.status(StatusCodes.OK).json(users); // Retornando todos os usuários
}

// Criar usuário
export const createUser = async (req: Request, res: Response) => {
    const users = await readUsers();
    const newUser: User = {id: users.length + 1, ...req.body};

    users.push(newUser);
    await writeUsers(users);

    return res.status(StatusCodes.OK).json(newUser); 
}

// Buscar usuário
export const getUserById = async (req: Request<{ id: string }>, res: Response) => {
    const users = await readUsers();
    const { id } = req.params; // Pegando o ID da URL

    const user = users.find((u:any) => u.id === parseInt(id)); // Procurando usuário pelo ID

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado'});
    }

    return res.status(StatusCodes.OK).json(user);
};

// Atualizar usuario
export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
    const users = await readUsers();
    const { id } = req.params;

    const userIndex = users.findIndex((u: any) => u.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body }; // Atualizar o usuário com novos dados
    await writeUsers(users); 

    return res.status(StatusCodes.OK).json(users[userIndex]);
};

// Deletar usuario
export const deleteUser = async (req: Request<{ id:string }>, res: Response) => {
    const users = await readUsers();
    const { id } = req.params;

    const newUsers = users.filter((u: any) => u.id !== parseInt(id)); // Filtrar o array removendo o usuário com o ID

    if (newUsers.length === users.length) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado'});
    }

    await writeUsers(newUsers); // Salvar o novo array
    return res.status(StatusCodes.NO_CONTENT).send();
};