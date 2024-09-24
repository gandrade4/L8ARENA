import express from 'express';

const app = express();
const port = 2222;

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Projeto Final</title></head>
            <body>
                <h1>Uma api para agendamento de quadras esportivas</h1>
                <p>Autores: Ana Julia Araujo da Silva, Ana Beatriz Claudio Machado, Carolaine Lima Bezerra, Gabriel Leitao de Andrade</p>
            </body>
        </html>
        `);
    });

app.listen(port, () => {
    console.log(`Servidor escutando a port ${port} em http://localhost:${port}`)
});