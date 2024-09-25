import { Router } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';

const router = Router ();
const usersFilePath = './server/database/userRoutes.ts';

const readUsers = () => {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeUsers = (data:any) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

//Listar usuários
router.get('/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

//Criar usuário
router.post('/users', (req, res) => {
    const users = readUsers();
    const newUser = {...req.body };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

//Atualizar usuário
router.put('users/:id', (req, res) => {
    const users = readUsers();
    const { id } = req.params;
    const userIndex = users.findIndex((u: any) => u.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado '});
    }
    users[userIndex] = {...users[userIndex], ...req.body };
    writeUsers(users);
    res.json(users[userIndex]);
});

//Remover usuário
router.delete('/users/:id', (req, res) => {
    const users = readUsers();
    const { id } = req.params;
    const newUsers = users.filter((u: any) => u.id !== parseInt(id));
    if (newUsers.length === users.length) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    writeUsers(newUsers);
    res.status(204).send();
  });
  
  export default router;