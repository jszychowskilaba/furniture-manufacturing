"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.login = void 0;
const authServices = __importStar(require("../services/authServices"));
const login = (req, res) => {
    const { body } = req;
    if (!body.username || !body.password) {
        res.status(400).send({
            status: 'Bad Request',
            data: {
                error: 'Missing keys. "name" or "pass"',
            },
        });
    }
    const userCredentials = {
        username: body.username,
        password: body.password,
    };
    try {
        if (authServices.isValidCredentials(userCredentials)) {
            const authTokens = authServices.generateTokens(userCredentials);
            res.status(200).send({ status: 'OK', data: authTokens });
        }
    }
    catch (error) {
        res
            .status((error === null || error === void 0 ? void 0 : error.status) || 500)
            .send({ status: 'FAILED', data: { error: (error === null || error === void 0 ? void 0 : error.message) || error } });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.send('logout');
};
exports.logout = logout;
const refreshToken = (req, res) => {
    res.send('refresh token');
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=authController.js.map