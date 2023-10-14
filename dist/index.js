"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const authRoutes_1 = __importDefault(require("./v1/routes/authRoutes"));
const inventoryRoutes_1 = __importDefault(require("./v1/routes/inventoryRoutes"));
const laborRoutes_1 = __importDefault(require("./v1/routes/laborRoutes"));
const authenticateUser_1 = __importDefault(require("./middlewares/authenticateUser/authenticateUser"));
const error_1 = __importDefault(require("./middlewares/handlers/error"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/inventory', authenticateUser_1.default, inventoryRoutes_1.default);
app.use('/api/v1/labor', authenticateUser_1.default, laborRoutes_1.default);
app.use('/secret-area', authenticateUser_1.default, (req, res) => {
    res.status(200).json('I am inside the secret area');
});
app.use(error_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map