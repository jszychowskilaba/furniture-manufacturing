"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.laborSchema = exports.materialSchema = exports.validateBody = void 0;
const ajv_1 = __importDefault(require("ajv"));
const materialSchema_1 = require("./schemas/materialSchema");
Object.defineProperty(exports, "materialSchema", { enumerable: true, get: function () { return materialSchema_1.materialSchema; } });
const laborSchema_1 = require("./schemas/laborSchema");
Object.defineProperty(exports, "laborSchema", { enumerable: true, get: function () { return laborSchema_1.laborSchema; } });
const validateBody = (schema) => {
    return (req, res, next) => {
        const data = req.body;
        const ajv = new ajv_1.default();
        const validate = ajv.compile(schema);
        if (validate(data)) {
            next();
        }
        else {
            const error = {
                status: 400,
                message: `Error in request body. ${JSON.stringify(validate.errors)}`,
            };
            next(error);
        }
    };
};
exports.validateBody = validateBody;
//# sourceMappingURL=index.js.map