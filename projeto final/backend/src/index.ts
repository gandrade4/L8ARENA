import express from 'express';
import userRoutes from './routes/userRoutes';
import { AppDataSource } from './dataSource';

async function startServer() {
   try {
    await AppDataSource.initialize()

    const app = express();
    const port = 2222;
    
    
    app.use(express.json());
    
    app.use('/users', userRoutes);
    
    app.listen(port, () => {
        console.log(`Servidor escutando a port ${port} em http://localhost:${port}`)
    })
} catch(e) {
    throw e 
}
}

startServer()