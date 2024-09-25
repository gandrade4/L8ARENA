import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../dataSource";
import { Quadra } from "../entity/Quadra";

// Listar quadras
export const getAllCourts = async (req: Request, res: Response) => {
    const courtRepository = AppDataSource.getRepository(Quadra)
    const courts = await courtRepository.find()
    res.json({
        data: courts
    })
}

// Criar quadra
export const createCourt = async (req: Request, res: Response) => {
    try {
        const { name, type, isAvailable } = req.body;
        const courtRepository = AppDataSource.getRepository(Quadra)
    
        const newCourt = courtRepository.create({
            name,
            type,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
        });

        await courtRepository.save(newCourt);
        res.status(StatusCodes.CREATED).json(newCourt);

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao criar quadra." });
    }
};

// Buscar quadra
export const getCourtById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const courtRepository = AppDataSource.getRepository(Quadra)

    const court = await courtRepository.findOne({
        where: {
            id: parseInt(id)   
        }
    })

    if (!court) {
        return res.status(StatusCodes.NOT_FOUND).json({ message:'Quadra não encontrada' });
    }
    res.json({
        data: court
    })
};

// Atualizar quadra
export const updateCourt = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const {name, type, isAvailable } = req.body

    const courtRepository = AppDataSource.getRepository(Quadra)
    const court = await courtRepository.findOne({
        where: {
            id: parseInt(id)
        }
    })

    if (!court) {
        return res.status(StatusCodes.NOT_FOUND).json({ message:'Quadra não encontrada' });
    }

    court.name = name ?? court.name
    court.type = type ?? court.type
    court.isAvailable = isAvailable ?? court.isAvailable

    await courtRepository.save(court)

    return res.status(StatusCodes.OK).json(court)
};

// Remover quadra
export const deleteCourt = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const courtRepository = AppDataSource.getRepository(Quadra);
    const court = await courtRepository.findOne({
        where: {
            id: parseInt(id)
        }
    })

    if (!court) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Quadra não encontrada'})
    }

    await courtRepository.remove(court)
    return res.status(StatusCodes.NO_CONTENT).json();

};