"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneLabor = void 0;
const getOneLabor = (req, res, next) => {
    const id = req.params.id;
    res.status(200).json(`I want to get one labor. The labor ID is: ${id}`);
};
exports.getOneLabor = getOneLabor;
//# sourceMappingURL=getOneLabor.js.map