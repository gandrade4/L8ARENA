"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes"); // Importando as regras de rota da pasta `routes`
// Criando uma aplicação Express
const server = (0, express_1.default)();
exports.server = server;
// Configurando o servidor para entender arquivos JSON
server.use(express_1.default.json());
// Usando as regras de rota definidas
server.use(routes_1.router);
