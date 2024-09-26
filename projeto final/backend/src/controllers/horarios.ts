import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../dataSource";
import { Quadra } from "../entity/Quadra";
import { Horario } from "../entity/Horario";

export const createSchedule = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const daysAhead = 3;
    const startHour = 13;
    const endHour = 20;

    const courtRepository = AppDataSource.getRepository(Quadra);
    
    const court = await courtRepository.findOne({
        where: {
            id: parseInt(id),
        },
        relations: ["horarios"] 
    });

    if (!court) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Quadra não encontrada.' });
    }

    const scheduleRepository = AppDataSource.getRepository(Horario);

    try {
        const schedules: Horario[] = [];

        for (let i = 0; i < daysAhead; i++) {
            const date = new Date();
            date.setDate(date.getDate() + 1);

            for (let hour = startHour; hour < endHour; hour++) {
                const startTime = new Date(date);
                startTime.setHours(hour, 0, 0, 0)

                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + 1);

                const newSchedule = scheduleRepository.create({
                    startTime: startTime,
                    endTime: endTime,
                    quadra: court
                });

                schedules.push(newSchedule);
            }
        }

        await scheduleRepository.save(schedules);
        court.horarios.push(...schedules);

        res.status(StatusCodes.CREATED).json(schedules); // Retorna os horários criados
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao criar horários.', err });
    }
}

export const getSchedulesByCourtId = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const scheduleRepository = AppDataSource.getRepository(Horario);

    try {
        const schedules = await scheduleRepository.find({
            where: { quadra: { id: parseInt(id) } },
        });

        if (schedules.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Nenhum horário encontrado para esta quadra.' });
        }

        res.json(schedules);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao listar horários.', err });
    }
};

export const updateSchedule = async (req: Request<{ courtId: string; scheduleId: string }>, res: Response) => {
    const { courtId, scheduleId } = req.params;
    const { startTime, endTime } = req.body;

    const scheduleRepository = AppDataSource.getRepository(Horario);

    try {
        const schedule = await scheduleRepository.findOne({ where: { id: parseInt(scheduleId), quadra: { id: parseInt(courtId) } } });

        if (!schedule) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Horário não encontrado.' });
        }

        schedule.startTime = new Date(startTime);
        schedule.endTime = new Date(endTime);

        await scheduleRepository.save(schedule);
        res.status(StatusCodes.OK).json(schedule);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao atualizar horário.', err });
    }
};

export const deleteSchedule = async (req: Request<{ courtId: string; scheduleId: string }>, res: Response) => {
    const { courtId, scheduleId } = req.params;
    const scheduleRepository = AppDataSource.getRepository(Horario);

    try {
        const schedule = await scheduleRepository.findOne({ where: { id: parseInt(scheduleId), quadra: { id: parseInt(courtId) } } });

        if (!schedule) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Horário não encontrado.' });
        }

        await scheduleRepository.remove(schedule);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao deletar horário.', err });
    }
};