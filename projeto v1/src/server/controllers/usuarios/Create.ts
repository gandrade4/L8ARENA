import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import fs from 'fs/promises'
import path from 'path';


interface User {
    id?: number,
    name: string,
    username: string,
    email: string,
    password: string,
    role?: string;
}

const dataPath = path.join(__dirname, '../../database/users.json');

const bodyValidation: yup.Schema<User> = yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    username: yup.string().required().min(3),
    password: yup.string().required().min(8)
});

export const createBodyValidator: RequestHandler = async (req, res, next) => {
    // Tenta validar os dados recebidos no corpo da requisição
    try {
        await bodyValidation.validate(req.body, { abortEarly: false});  // abortEarly: Validando todos os erros primeiro
        return next();  // Executa o próximo handler
    } catch (err) {  // Se ocorrer um erro o código entrará no bloco `catch`
        const yupError = err as yup.ValidationError;  // Convertendo o erro para ValidationError
        const errors: Record<string, string> = {};  // Criando um objeto para armazenar os erros de validação

        // Processa cada erro de requisição e adiciona ao objeto `errors`
        yupError.inner.forEach(error => {
            if (error.path === undefined) return;
            errors[error.path] = error.message;
        });


        // Envia uma resposta de erro para o cliente com detalhes dos problemas encontrados
        return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }
};



export const create = async (req: Request<{}, {}, User>, res: Response) => {
    console.log(req.body);

    const data = await fs.readFile(dataPath, 'utf-8');  // Lendo o arquivo JSON que contém os dados dos usuários
    const users:  User[] = JSON.parse(data);  // Transforma os dados lidos em um array de usuários
    
    const newUser: User = req.body;  // Cria um novo usuário apartir dos dados recebidos na requisição
    newUser.id = users.length ? users[users.length - 1].id! + 1 : 1;  // ´users.length ? ... : ...´ é uma estrutura de decisão; condição ? valor_se_verdadeiro : valor_se_falso;
    users.push(newUser);  // Adiciona novo usuário ao array 

    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));  // Converte o array de volta para uma string JSON e escreve no arquivo
     
    return res.send('Criando...');

};
