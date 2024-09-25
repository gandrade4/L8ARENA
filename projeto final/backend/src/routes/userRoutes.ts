import { Router } from 'express'
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/usuarios';
import { validateUserBody } from '../middleware/validationMiddleware';


const router = Router()


//Criar usuário
router.post('/', validateUserBody, createUser);

//Listar usuários
router.get('/', getAllUsers);

//Buscar usuário
router.get('/:id', getUserById);

//Atualizar usuário
router.put('/:id', validateUserBody, updateUser);

//Deletar usuário
router.delete('/:id', deleteUser);

export default router;