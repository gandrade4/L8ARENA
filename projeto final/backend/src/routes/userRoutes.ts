import { Router } from 'express'
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/usuarios';
import { validateUser } from '../middleware/validation';


const router = Router()

//Criar usuário
router.post('/users', validateUser, createUser);

//Listar usuários
router.get('/users', getAllUsers);

//Buscar usuário
router.get('/users/:id', getUserById);

//Atualizar usuário
router.put('/users/:id', validateUser, updateUser);

//Deletar usuário
router.delete('/users/:id', deleteUser);

export default router;