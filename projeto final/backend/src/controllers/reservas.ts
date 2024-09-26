import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../dataSource";
import { Reserva } from "../entity/Reserva";
import { Quadra } from "../entity/Quadra";
import { LessThan, MoreThan } from "typeorm";


// Criar reserva
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { courtId, startTime, endTime } = req.body;

        const courtRepository = AppDataSource.getRepository(Quadra);
        const court = await courtRepository.findOne({
            where: {id: courtId},
        });

        if (!court) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Quadra não encontrada." });
        }

        if (!court.isAvailable) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "A quadra não está disponível para reserva." })
        }

        const existingBooking = await AppDataSource.getRepository(Reserva).find({
            where: {
                quadra: { id: courtId },
                startTime: LessThan(endTime),
                endTime: MoreThan(startTime),
            },
        });

        if ( existingBooking.length > 0 ) {
            return res.status(StatusCodes.CONFLICT).json({ message:"Este horário já está reservado."  });
        }

        const bookingRepository = AppDataSource.getRepository(Reserva);
        const newBooking = bookingRepository.create({
            quadra: court,
            startTime,
            endTime,
        });

        await bookingRepository.save(newBooking);
        res.status(StatusCodes.CREATED).json(newBooking);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao criar a reserva.", err });
    }
}