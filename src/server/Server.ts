import express from 'express'; 
import { router } from './routes'; // Importando rotas de um arquivo separado




// Criando uma aplicação Express
const server = express(); 

// Configurando o servidor para receber arquivos JSON
server.use(express.json());

// Usando as regras de rota definidas no arquivo `routes`
server.use(router);



export { server };