"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneMaterial = void 0;
const getOneMaterial = (req, res, next) => {
    const id = req.params.id;
    res.status(200).json(`I want to get one material. The material ID is: ${id}`);
};
exports.getOneMaterial = getOneMaterial;
//# sourceMappingURL=getOneMaterial.js.map