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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshTokens = exports.login = void 0;
const updateTokens_1 = __importDefault(require("./auth-utils/updateTokens"));
const isValidCredentials_1 = __importDefault(require("./auth-utils/isValidCredentials"));
const Auth = __importStar(require("../../databases/Auth"));
const refreshTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenType = yield Auth.getTokenType(refreshToken);
    if (tokenType === 'refreshToken') {
        const username = yield Auth.getUsernameFromToken(refreshToken);
        if (username) {
            const userCredentials = {
                client_id: username,
                client_secret: null,
            };
            return (0, updateTokens_1.default)(userCredentials);
        }
    }
    const error = {
        status: 401,
        message: 'Refresh token not valid',
    };
    throw error;
});
exports.refreshTokens = refreshTokens;
const logout = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const username = yield Auth.getUsernameFromToken(token);
    if (!username) {
        const error = {
            status: 401,
            message: 'Invalid refresh token',
        };
        throw error;
    }
    const refreshToken = yield Auth.getAsync(`${username}.refreshToken`);
    yield Auth.deleteAsync(token);
    yield Auth.deleteAsync(`${username}.token`);
    if (refreshToken) {
        yield Auth.deleteAsync(refreshToken);
        yield Auth.deleteAsync(`${username}.refreshToken`);
    }
});
exports.logout = logout;
const login = (userCredentials) => __awaiter(void 0, void 0, void 0, function* () {
    (0, isValidCredentials_1.default)(userCredentials);
    return (0, updateTokens_1.default)(userCredentials);
});
exports.login = login;
//# sourceMappingURL=authServices.js.map