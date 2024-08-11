import { Router } from 'express'; // O `Router` divide o nosso servidor em seções
import { StatusCodes } from 'http-status-codes';

import { UserController } from '../controllers';

const router =  Router();

router.get('/', (_,res) => {
    return res.send('ola');
});


// Criando uma rota de requisições `POST` no caminho `/usuarios` 
// `UserController.createValidation` valida os dados antes de passar para o controlador (middleware)
// `UserController.create` processa a requisição e executa a lógica para criar um usuário
router.post('/users', UserController.createBodyValidator, UserController.create);
//router.get('/users/:id', UserController.list);
//router.put('/users/:id', UserController.createBodyValidator, UserController.update);
//router.delete('/users/:id', UserController.remove);

// Exportanto as regras de rota p/ serem utilizadas no servidor
export { router }; 