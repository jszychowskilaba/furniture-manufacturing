"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
    res.status(error.status).json(error.message);
};
exports.default = errorHandler;
//# sourceMappingURL=error.js.map