import { Router } from "express";
import { createSchedule, deleteAllSchedules } from "../controllers/horario";


const router = Router()

router.post('/quadras/:id/schedule', createSchedule);
router.delete('/quadras/:id/schedule', deleteAllSchedules);

export default router