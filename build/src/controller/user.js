"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.listUsers = exports.createUser = void 0;
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
const listUsers = () => users;
exports.listUsers = listUsers;
const getUser = (userId) => {
    return users.find(user => user.id === userId);
};
exports.getUser = getUser;
const updateUser = (userId, userData) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].name = userData.name;
        users[userIndex].email = userData.email;
        return users[userIndex];
    }
    return undefined;
};
exports.updateUser = updateUser;
const deleteUser = (userId) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        return deletedUser;
    }
    return undefined;
};
exports.deleteUser = deleteUser;
