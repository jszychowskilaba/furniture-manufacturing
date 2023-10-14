"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLabor = void 0;
const updateLabor = (req, res, next) => {
    const id = req.params.id;
    res
        .status(200)
        .json(`I want to update a labor. The labor ID is: ${id}`);
};
exports.updateLabor = updateLabor;
//# sourceMappingURL=updateLabor.js.map