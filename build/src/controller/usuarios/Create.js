"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
let users = [];
const createUser = (userData) => {
    const newUser = {
        id: String(users.length + 1),
        name: userData.name,
        email: userData.email
    };
    users.push(newUser);
    return newUser;
};
exports.createUser = createUser;
