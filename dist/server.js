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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const Auth_1 = require("./databases/Auth");
(() => __awaiter(void 0, void 0, void 0, function* () {
    Auth_1.TokensDB.on('error', (error) => {
        throw error;
    });
    try {
        yield Auth_1.TokensDB.connect();
    }
    catch (error) {
        console.log('Redis TokensDB', error);
    }
}))();
const PORT = Number(process.env.PORT) || 3000;
index_1.default.listen(PORT, () => {
    console.log(`API listening port ${PORT}...`);
});
//# sourceMappingURL=server.js.map