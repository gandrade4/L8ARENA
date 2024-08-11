import { Router } from 'express'; // O `Router` divide o nosso servidor em seções
import { StatusCodes } from 'http-status-codes';

import { UserController } from '../../controllers';

const router =  Router();

router.get('/', (_,res) => {
    return res.send('ola');
});

router.post('/usuarios',/* UserController.createValidation,*/ UserController.create);

//Exportanto as regras de rota p/ serem utilizadas no servidor
export { router }; 
