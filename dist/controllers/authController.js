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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.logout = exports.login = void 0;
const authServices = __importStar(require("../services/authServices"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    if (!body.username || !body.password) {
        res.status(400).json({
            status: 'Cannot log in',
            error: 'Missing keys. "name" or "pass"',
        });
        return;
    }
    const userCredentials = {
        username: body.username,
        password: body.password,
    };
    try {
        const [newToken, newRefreshToken] = yield authServices.login(userCredentials);
        res.status(200).json({ newToken, newRefreshToken });
    }
    catch (error) {
        res.status(error.status).json(error.message);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('authorization');
    try {
        if (token) {
            yield authServices.logout(token);
            res.status(200).json('Successful logout');
            return;
        }
    }
    catch (error) {
        res.status(error.status).json(error.message);
        return;
    }
    const error = {
        status: 500,
        message: 'Unespected server error after logout.',
    };
    res.status(error.status).json(error.message);
});
exports.logout = logout;
const refreshTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oldRefreshToken = req.header('authorization');
    if (!oldRefreshToken) {
        const error = {
            status: 400,
            message: 'Refresh token is missing',
        };
        res.status(error.status).json(error.message);
        return;
    }
    try {
        const [newToken, newRefreshToken] = yield authServices.refreshTokens(oldRefreshToken);
        res.status(200).json({ newToken, newRefreshToken });
    }
    catch (error) {
        res.status(error.status).json(error.message);
    }
});
exports.refreshTokens = refreshTokens;
//# sourceMappingURL=authController.js.map