import express from 'express';
import userRoutes from './routes/userRoutes';
import quadraRoutes from './routes/quadraRoutes';
//import reservaRoutes from './routes/reservaRoutes'; comentei pois ainda nao tinha essa parte
import authRoutes from './routes/authRoutes'
import { AppDataSource } from './dataSource';
import cors from 'cors'; 


async function startServer() {
   try {
    await AppDataSource.initialize()

    const app = express();
    const port = 2222;

    app.use(cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        credentials: true
    }));
    
    app.use(express.json());
    
    app.use('/users', userRoutes);
    app.use('/quadras', quadraRoutes);
    //app.use('/reservas', reservaRoutes);
    app.use('/', authRoutes);
    
    app.listen(port, () => {
        console.log(`Servidor escutando a port ${port} em http://localhost:${port}`)
    })
} catch(e) {
    throw e 
}
}

startServer()
