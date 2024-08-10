"use strict";
/*import express from 'express';

const server = express();

server.get(`/`, (req, res) =>{
    
    const htmlResponse = `
        <html>
            <body style="background-color: #e5e5e5">
                <h1>Um site de locação de quadras esportivas</h1>
                <h2>por Ana Beatriz, Ana Julia, Carolaine e Gabriel</h2>
            </body>
        </html>`;

        res.send(htmlResponse);
});

export {server};*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const server = (0, express_1.default)();
exports.server = server;
server.use(express_1.default.json());
server.use(routes_1.router);
