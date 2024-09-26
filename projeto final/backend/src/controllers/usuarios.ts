import { Request, Response } from  'express';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../dataSource';
import { User } from '../entity/User'
import { Role } from '../entity/Role';
import bcrypt from 'bcryptjs'


//Listar usuários
export const getAllUsers = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)
    const users = await userRepository.find({ relations: ['role']})
    res.json({
        data: users
    })
}

// Criar usuário
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, role } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const roleRepository = AppDataSource.getRepository(Role);

        // Verificar se o papel existe no banco de dados
        let roleInDB = await roleRepository.findOne({ where: { name: role } });

        // Se o papel não existe, crie um novo
        if (!roleInDB) {
            roleInDB = roleRepository.create({ name: role });
            await roleRepository.save(roleInDB);
        }

        // Criar o novo usuário
        const hashedPassword = bcrypt.hashSync(password, 10)
        
        const newUser = userRepository.create({
            name,
            username,
            email,
            password: hashedPassword,
            role: roleInDB,
        });

        await userRepository.save(newUser);

        res.status(StatusCodes.CREATED).json(newUser);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao criar o usuário.", err });
    }
};

// Buscar usuário
export const getUserById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params; // Pegando o ID da URL
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
        where: {
            id: parseInt(id) // Procurando usuário pelo ID
        },
        relations: ['role']
      }) 

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado'});
    }
    res.json({
        data: user
    })
};

// Atualizar usuario
export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { name, username, email, password, role } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: {
            id: parseInt(id)
        },
        relations: ['role']
     })

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado' });
    }

    if (username !== user.username) {
        const existingUser = await userRepository.findOneBy({ username });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: "O nome de usuário já está em uso." });
        }
    }

    const roleRepository = AppDataSource.getRepository(Role);
    let roleInDB = await roleRepository.findOne({ where: { name: role } });

        // Se o papel não existe, crie um novo
        if (!roleInDB) {
            roleInDB = roleRepository.create({ name: role });
            await roleRepository.save(roleInDB);
        }


    user.name = name ?? user.name;
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ?? user.password;
    user.role = roleInDB;

    await userRepository.save(user)
    return res.status(StatusCodes.OK).json(user);
};

// Deletar usuario
export const deleteUser = async (req: Request<{ id:string }>, res: Response) => {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: {
            id: parseInt(id)
        },
        relations: ['role']
     })

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado' });
    }

    await userRepository.remove(user)
    return res.status(StatusCodes.NO_CONTENT).json();
};