"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
// O router contém regras que definem como o servidor responde a diferentes pedido
const routes_1 = require("./routes");
// Criando um servidor usando a ferramenta Express
const server = (0, express_1.default)();
exports.server = server;
// Configurando o Express para interpretar dados no formato Json 
server.use(express_1.default.json());
// Dizendo ao servidor para usar as regras de rota que definimos no arquivo `routes.js`
server.use(routes_1.router);
