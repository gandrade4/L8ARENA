interface User {
    id: string;
    name: string;
    email: string;
}

let users: User[] = [];

export const createUser = (userData: { name:string, email:string }): User => {
    const newUser: User = {
        id: String(users.length + 1),
        name: userData.name,
        email: userData.email
    };
    users.push(newUser);
    return newUser;
};

export const listUsers = (): User[] => users;

export const getUser = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
};

export const updateUser = (userId: string, userData: { name:string, email: string }): User | undefined => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].name = userData.name;
        users[userIndex].email = userData.email;
        return users[userIndex];
    }
    return undefined;
};

export const deleteUser = (userId: string): User | undefined => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        return deletedUser;
    }
    return undefined;
};