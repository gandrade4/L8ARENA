import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';


interface User {
    nome: string;
    email: string;
    senha: string;
}


const bodyValidation: yup.Schema<User> = yup.object().shape({
    nome: yup.string().required().min(3),
    email: yup.string().required().email(),
    senha: yup.string().required().min(8)
});

export const create = async (req: Request<{}, {}, {} , {}, User>, res: Response) => {
    let validateData: User | undefined = undefined;

    // Tenta validar os dados recebidos no corpo da requisição
    try {
        validateData = await bodyValidation.validate(req.body, { abortEarly: false});  
    } catch (error) {  // Se ocorrer um erro o código entrará no bloco `catch`
        const yupError = error as yup.ValidationError;  // Convertendo o erro para ValidationError
        const validationErrors: Record<string, string> = {};  // Criando um objeto para armazenar os erros de validação

        // Processa cada erro de requisição e adiciona ao objeto `validationErrors`
        yupError.inner.forEach(error => {
            if (error.path === undefined) return;
            validationErrors[error.path] = error.message;
        })


        // Envia uma resposta de erro para o cliente com detalhes dos problemas encontrados
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: validationErrors
        })
    }

    console.log(validateData);

};


/*export const create = async (req: Request<{}, {}, {} , {}, User>, res: Response) => {
    console.log(req.body)

    return res.send(StatusCodes.INTERNAL_SERVER_ERROR).send('Não Implementado');
};*/
