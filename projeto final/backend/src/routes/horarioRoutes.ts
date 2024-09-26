import { Router } from "express";
import { createSchedule, getSchedulesByCourtId, updateSchedule, deleteSchedule } from "../controllers/horarios";
import { AppDataSource } from "../dataSource";
import { Quadra } from "../entity/Quadra";
import { Horario } from "../entity/Horario";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router()

router.post('/quadras/:id/horarios', createSchedule);
// Rota para pegar horários de uma quadra específica
router.get('/quadras/:id/horarios', async (req: Request, res: Response) => {
    const { id } = req.params;
    const courtRepository = AppDataSource.getRepository(Quadra);
    const horarioRepository = AppDataSource.getRepository(Horario);

    try {
        const court = await courtRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['horarios']
        });

        if (!court) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Quadra não encontrada.' });
        }

        const horarios = await horarioRepository.find({
            where: { quadra: court },
        });

        res.status(StatusCodes.OK).json({ horarios });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar horários.', err });
    }
});
router.put('/quadras/horarios/:id', updateSchedule);
router.delete('/quadras/horarios/:id', deleteSchedule);


export default router