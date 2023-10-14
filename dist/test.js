"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const foo_ti_1 = __importDefault(require("./foo-ti"));
const ts_interface_checker_1 = require("ts-interface-checker");
const { Square } = (0, ts_interface_checker_1.createCheckers)(foo_ti_1.default);
Square.check({ size: 1 });
Square.check({ size: 1, color: "green" });
Square.check({ color: "green" });
Square.check({ size: 4, color: 5 });
//# sourceMappingURL=test.js.map