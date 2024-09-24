import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 2222;


app.use(express.json());

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Servidor escutando a port ${port} em http://localhost:${port}`)
});