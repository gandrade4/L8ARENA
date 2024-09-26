import { Router } from 'express';
import { createReserva, getAllReservas, getReservaById, updateReserva, deleteReserva } from '../controllers/reservas';

const router = Router();

router.post('/', createReserva);
router.get('/', getAllReservas);
router.get('/:id', getReservaById);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);

export default router;
