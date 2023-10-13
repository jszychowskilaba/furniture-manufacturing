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
const uuid_1 = require("uuid");
const Auth = __importStar(require("../../databases/Auth"));
const updateTokens = (userCredentials) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenKey = `${userCredentials.client_id}.token`;
    const refreshTokenKey = `${userCredentials.client_id}.refreshToken`;
    const oldToken = yield Auth.getAsync(tokenKey);
    const oldRefreshToken = yield Auth.getAsync(refreshTokenKey);
    if (oldToken) {
        yield Auth.deleteAsync(oldToken);
        yield Auth.deleteAsync(tokenKey);
    }
    if (oldRefreshToken) {
        Auth.deleteAsync(oldRefreshToken);
        Auth.deleteAsync(refreshTokenKey);
    }
    const newToken = (0, uuid_1.v4)();
    const newRefreshToken = (0, uuid_1.v4)();
    const newTokenExpiration = Number(process.env.TOKEN_EXPIRATION) || 300;
    const newRefreshTokenExpiration = Number(process.env.REFRESH_TOKEN_EXPIRATION) || 19200;
    yield Auth.storeAsync(tokenKey, newToken, newTokenExpiration);
    yield Auth.storeAsync(newToken, tokenKey, newTokenExpiration);
    yield Auth.storeAsync(refreshTokenKey, newRefreshToken, newRefreshTokenExpiration);
    yield Auth.storeAsync(newRefreshToken, refreshTokenKey, newRefreshTokenExpiration);
    return [newToken, newRefreshToken];
});
exports.default = updateTokens;
//# sourceMappingURL=updateTokens.js.map