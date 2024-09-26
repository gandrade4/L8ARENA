import { Router } from "express";
import { createBooking } from "../controllers/reservas";

const router = Router();

// Criar reserva
router.post('/', createBooking);

export default router;