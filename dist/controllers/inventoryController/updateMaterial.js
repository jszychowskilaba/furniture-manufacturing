"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaterial = void 0;
const updateMaterial = (req, res, next) => {
    const id = req.params.id;
    res
        .status(200)
        .json(`I want to update a material. The material ID is: ${id}`);
};
exports.updateMaterial = updateMaterial;
//# sourceMappingURL=updateMaterial.js.map