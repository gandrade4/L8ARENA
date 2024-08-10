import express from 'express';
import { router } from './routes'; // Importando regras de rota




// Criando um servidor usando a ferramenta Express
const server = express(); 

// Configurando o Express para interpretar dados no formato Json 
server.use(express.json()); 

// Dizendo ao servidor para usar as regras de rota que definimos no arquivo `routes.js`
server.use(router);





export { server };