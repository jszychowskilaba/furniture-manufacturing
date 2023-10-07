"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./v1/routes/authRoutes"));
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.use(body_parser_1.default.json());
app.use('/api/v1/auth', authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`API listening port ${PORT}...`);
});
exports.default = app;
//# sourceMappingURL=index.js.map