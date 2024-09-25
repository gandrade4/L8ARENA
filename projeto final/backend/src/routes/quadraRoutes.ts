import { Router } from "express";
import { createCourt, getAllCourts, getCourtById, updateCourt, deleteCourt } from '../controllers/quadras'
import { validateCourtBody } from "../middleware/validationMiddleware";

const router = Router();

//Criar quadra
router.post('/', validateCourtBody, createCourt);

//Listar quadras
router.get('/', getAllCourts);

//Buscar quadra
router.get('/:id', getCourtById);

//Atualizar quadra
router.put('/:id', validateCourtBody, updateCourt);

//Deletar quadra
router.delete('/:id', deleteCourt);

export default router;