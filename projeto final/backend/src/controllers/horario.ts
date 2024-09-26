import { Request, Response } from "express";
import { Quadra } from "../entity/Quadra";
import { Horario } from "../entity/Horario";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../dataSource";

export const createSchedule = async (req: Request<{ id: string }>, res: Response) => {

    const { id } = req.params;
    const daysAhead = 3; // Criar horários para 3 dias
    const startHour = 13; // Início às 16h
    const endHour = 20; // Fim às 23h (exclusivo)

    const courtRepository = AppDataSource.getRepository(Quadra);
    const scheduleRepository = AppDataSource.getRepository(Horario);

    try {
        const court = await courtRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: ["horarios"] // Relacionar horários existentes
        });

        if (!court) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Quadra não encontrada.' });
        }

        const schedules = [];

        for (let i = 0; i < daysAhead; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            // Corrigido para hour < endHour para não passar das 23:00
            for (let hour = startHour; hour < endHour; hour++) {
                const startTime = new Date(date);
                startTime.setHours(hour, 0, 0, 0); // Definir o horário local corretamente

                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + 1);

                const newSchedule = scheduleRepository.create({
                    startTime: startTime.toISOString(), // Garantir que o formato seja ISO
                    endTime: endTime.toISOString(),
                    quadra: court, // Associa o horário à quadra
                });

                schedules.push(newSchedule); // Adiciona o horário ao array
            }
        }

        await scheduleRepository.save(schedules); // Salva todos os horários em uma única operação
        court.horarios.push(...schedules); // Atualiza a lista de horários da quadra

        res.status(StatusCodes.CREATED).json(court);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao criar horários.', err });
    }
};

export const getCourtSchedules = async (req: Request<{id: string}>, res: Response) => {
    const { id } = req.params;

    const courtRepository = AppDataSource.getRepository(Quadra);

    try {
        // Encontre a quadra com os horários
        const court = await courtRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: ["horarios"], // Relacione os horários
        });

        // Verifique se a quadra existe
        if (!court) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Quadra não encontrada.' });
        }

        // Retorne apenas os horários
        res.status(StatusCodes.OK).json({
            id: court.id,
            name: court.name,
            horarios: court.horarios.map(horario => ({
                startTime: horario.startTime,
                endTime: horario.endTime,
            })),
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar quadra e horários.', err });
    }
};


export const deleteAllSchedules = async (req: Request, res: Response) => {
    const scheduleRepository = AppDataSource.getRepository(Horario);

    try {
        // Remove todos os registros da tabela horarios
        await scheduleRepository.clear(); // clear() remove todos os registros

        res.status(StatusCodes.OK).json({ message: 'Todos os horários foram removidos com sucesso.' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao remover horários.', err });
    }
};
