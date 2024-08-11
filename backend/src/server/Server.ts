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







import express from 'express';
import { router } from './routes';



const server = express(); 

server.use(express.json());

server.use(router);





export { server };