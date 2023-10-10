"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./v1/routes/authRoutes"));
require("dotenv/config");
const authenticateUser_1 = __importDefault(require("./middlewares/authenticateUser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/secret-area', authenticateUser_1.default, (req, res) => {
    res.status(200).json('I am inside the secret area');
});
exports.default = app;
//# sourceMappingURL=index.js.map