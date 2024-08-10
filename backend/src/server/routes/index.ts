import { Router } from 'express'; //O Router permite criar um middleware pro nosso servidor 
import { StatusCodes } from 'http-status-codes';

import { UserController } from './../controllers';

const router =  Router();


export { router }; //Exportanto as rotas p serem utilizadas no servidor
