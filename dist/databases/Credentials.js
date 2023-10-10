"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCredentials = void 0;
const DB = [
    { username: 'jose', password: '123456' },
    { username: 'juan', password: '5678910' },
];
const isValidCredentials = (userCredentials) => {
    const isValid = DB.find((credential) => credential.username === userCredentials.username
        && credential.password === userCredentials.password);
    if (isValid)
        return true;
    const error = {
        status: 404,
        message: 'Invalid user or password',
    };
    throw error;
};
exports.isValidCredentials = isValidCredentials;
//# sourceMappingURL=Credentials.js.map