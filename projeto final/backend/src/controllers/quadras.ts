import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../dataSource";

// Listar quadras
export const getAllCourts = async (req: Request, res: Response) {

}

// Criar quadra
export const createCourt = async (req: Request, res: Response) {

}

// Buscar quadra
export const getCourtById = async (req: Request<{ id: string }>, res: Response) {

}

// Atualizar quadra
export const updateCourt = async (req: Request<{ id: string }>, res: Response) {

}

// Remover quadra
export const deleteCourt = async (req: Request<{ id: string }>, res: Response) {

}