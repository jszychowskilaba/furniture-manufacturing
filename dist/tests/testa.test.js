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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const Auth_1 = require("../databases/Auth");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    Auth_1.TokensDB.on('error', (error) => {
        throw error;
    });
    try {
        yield Auth_1.TokensDB.connect();
    }
    catch (error) {
        console.log('Redis TokensDB', error);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Auth_1.TokensDB.quit();
}));
describe('Sample Test', () => {
    test('should test that true === true', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get('/secret-area').set('Authorization', 'b246784f-a45e-4c81-a379-1695da6468bc');
        console.log(response.body);
    }));
});
//# sourceMappingURL=testa.test.js.map