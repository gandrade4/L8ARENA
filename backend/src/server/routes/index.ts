import { Router } from 'express'; //O Router permite criar um middleware pro nosso servidor 
import { StatusCodes } from 'http-status-codes';

import { UserController } from './../../controllers';

const router =  Router();

router.get('/', (_,res) => {
    return res.send('ola');
});

router.post('/usuarios', UserController.createValidation, UserController.create);


export { router }; //Exportanto as rotas p serem utilizadas no servidor
