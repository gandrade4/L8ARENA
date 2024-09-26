import { Router } from "express";
import { createSchedule, deleteAllSchedules, getCourtSchedules } from "../controllers/horario";


const router = Router()

router.get("/quadras/:id/schedule", getCourtSchedules);
router.post('/quadras/:id/schedule', createSchedule);
router.delete('/quadras/schedule', deleteAllSchedules);

export default router