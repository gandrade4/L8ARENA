import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource';
import { Reserva } from '../entity/Reserva';
import { Quadra } from '../entity/Quadra';
import { User } from '../entity/User';
import { StatusCodes } from 'http-status-codes';

export const createReserva = async (req: Request, res: Response) => {
    const {userId, quadraId, reservaData, startTime, endTime} = req.body;

    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const userRepository = AppDataSource.getRepository(User);
        const quadraRepository = AppDataSource.getRepository(Quadra);

        const user = await userRepository.findOne({ 
            where: { 
                id: userId 
                } 
            });
        const quadra = await quadraRepository.findOne({ 
            where: { 
                id: quadraId 
            } 
        });

        if (!user || !quadra) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário ou quadra não encontrados.' });
        }

        const newReserva = reservaRepository.create({
            user,
            quadra,
            reservaData,
            startTime,
            endTime
        });

        await reservaRepository.save(newReserva);

        res.status(StatusCodes.CREATED).json(newReserva);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao criar reserva', error });
    }
};

export const getAllReservas = async (req: Request, res: Response) => {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const reservas = await reservaRepository.find({ 
            relations: ['user', 'quadra'] 
        });
        res.json(reservas);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar reservas', error });
    }
};

export const getReservaById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const reserva = await reservaRepository.findOne({
            where: { 
                id: parseInt(id) 
            },
            relations: ['user', 'quadra']
        });

        if (!reserva) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Reserva não encontrada' });
        }

        res.json(reserva);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar reserva', error });
    }
};

export const updateReserva = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { reservaData, startTime, endTime, userId, quadraId } = req.body;

    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const userRepository = AppDataSource.getRepository(User);
        const quadraRepository = AppDataSource.getRepository(Quadra);

        const reserva = await reservaRepository.findOne({ where: { id: parseInt(id) } });

        if (!reserva) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Reserva não encontrada' });
        }

        // Atualiza os campos da reserva
        reserva.reservaData = reservaData || reserva.reservaData;
        reserva.startTime = startTime || reserva.startTime;
        reserva.endTime = endTime || reserva.endTime;

        // Se userId ou quadraId foram enviados, atualiza
        if (userId) {
            const user = await userRepository.findOne({ where: { id: userId } });
            if (user) reserva.user = user;
        }

        if (quadraId) {
            const quadra = await quadraRepository.findOne({ where: { id: quadraId } });
            if (quadra) reserva.quadra = quadra;
        }

        await reservaRepository.save(reserva);

        res.json(reserva);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao atualizar reserva', error });
    }
};

export const deleteReserva = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const reserva = await reservaRepository.findOne({ where: { id: parseInt(id) } });

        if (!reserva) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Reserva não encontrada' });
        }

        await reservaRepository.remove(reserva);
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao deletar reserva', error });
    }
};