import { server } from "./routes/Server";

const router = Router();

router.get('/', (_,res) => {
    return res.send();
});



server.listen(3333, ()=>console.log('funcionou!'))