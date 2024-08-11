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


import { server } from './src/server/Server';

server.listen(3333, () => console.log('App rodando!'));
