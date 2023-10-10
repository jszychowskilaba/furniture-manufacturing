"use strict";
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
exports.getUsernameFromToken = exports.getTokenType = exports.deleteAsync = exports.getAsync = exports.storeAsync = exports.TokensDB = void 0;
const redis_1 = require("redis");
require("dotenv/config");
const TokensDB = (0, redis_1.createClient)({ url: 'redis://AuthDB:6379' });
exports.TokensDB = TokensDB;
const storeAsync = (key, value, expirationTime) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCreated = yield TokensDB.set(key, value);
        yield TokensDB.expire(key, expirationTime);
        if (!isCreated) {
            const error = {
                status: 500,
                message: 'Can not create token',
            };
            throw error;
        }
    }
    catch (err) {
        const error = {
            status: err.status || 500,
            message: err.message || `${err}`,
        };
        throw { error };
    }
});
exports.storeAsync = storeAsync;
const getAsync = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield TokensDB.get(key);
        return token;
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Can not get token. ${err}`,
        };
        throw error;
    }
});
exports.getAsync = getAsync;
const deleteAsync = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield TokensDB.del(key);
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Can not get token. ${err}`,
        };
        throw { error };
    }
});
exports.deleteAsync = deleteAsync;
const getTokenType = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameKey = yield getAsync(token);
    if (usernameKey) {
        const regex = /(?<token>^(.+)\.token$)|(?<refreshToken>^(.+)\.refreshToken$)/;
        const match = regex.exec(usernameKey);
        if (match && match.groups) {
            if (match.groups.token)
                return 'token';
            if (match.groups.refreshToken)
                return 'refreshToken';
        }
    }
    return undefined;
});
exports.getTokenType = getTokenType;
const getUsernameFromToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenType = yield getTokenType(token);
    if (tokenType) {
        const usernameKey = yield getAsync(token);
        if (usernameKey) {
            if (tokenType === 'token')
                return usernameKey.slice(0, -6);
            if (tokenType === 'refreshToken')
                return usernameKey.slice(0, -13);
        }
    }
    return undefined;
});
exports.getUsernameFromToken = getUsernameFromToken;
//# sourceMappingURL=Auth.js.map