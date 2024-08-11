import express from 'express'; 
import { router } from './routes'; // Importando as regras de rota da pasta `routes`




// Criando uma aplicação Express
const server = express(); 

// Configurando o servidor para entender arquivos JSON
server.use(express.json());

// Usando as regras de rota definidas
server.use(router);



export { server };