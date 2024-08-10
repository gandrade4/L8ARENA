import { Request, Response } from 'express';
import { }


interface User {
    id:string;
    name: string;
    email: string;
}

let users: User [] = [];

export const createUser = (userData: { name:string, email:string }): User => {
    const newUser: User = {
        id: String(users.length +1),
        name: userData.name,
        email: userData.email  
    };
    users.push(newUser);
    return newUser;
}