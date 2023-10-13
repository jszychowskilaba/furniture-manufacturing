"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCredentials = void 0;
const DB = [
    { client_id: 'jose', client_secret: '123456' },
    { client_id: 'juan', client_secret: '5678910' },
];
const isValidCredentials = (userCredentials) => {
    const isValid = DB.find((credential) => credential.client_id === userCredentials.client_id &&
        credential.client_secret === userCredentials.client_secret);
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