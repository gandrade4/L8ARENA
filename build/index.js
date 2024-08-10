"use strict";
/*import { server } from "./routes/Server";

const router = Router();

router.get('/', (req, res) => {
    const htmlResponse = `
        <html>
            <body>
                <h1>Um site de locação de quadras esportivas</h1>
                <p>por Ana Beatriz, Ana Julia, Carolaine e Gabriel</p>
            </body>
        </html>
        `;
    res.send(htmlResponse);
});



server.listen(3333, ()=>console.log('funcionou!'))*/
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./src/server/Server");
Server_1.server.listen(3333, () => console.log('App rodando!'));
