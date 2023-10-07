"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCredentials = void 0;
const DB = [
    { username: 'jose', password: '123456' },
    { username: 'juan', password: '5678910' },
];
const isValidCredentials = (userCredentials) => {
    DB.forEach((credential) => {
        if (credential.username === userCredentials.username
            && credential.password === userCredentials.password) {
            return true;
        }
    });
    throw { status: 404, message: 'Invalid user or password' };
};
exports.isValidCredentials = isValidCredentials;
//# sourceMappingURL=Credentials.js.map