import { Router } from 'express'
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/usuarios';
import { validateUser } from '../middleware/validationMiddleware';


const router = Router()


//Criar usuário
router.post('/',validateUser, createUser);

//Listar usuários
router.get('/', getAllUsers);

//Buscar usuário
router.get('/:id', getUserById);

//Atualizar usuário
router.put('/:id', validateUser, updateUser);

//Deletar usuário
router.delete('/:id', deleteUser);

export default router;