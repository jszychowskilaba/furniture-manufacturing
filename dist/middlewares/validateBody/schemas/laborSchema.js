"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.laborSchema = void 0;
exports.laborSchema = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: ['active', 'inactive'], nullable: true },
        internalCode: { type: 'string', minLength: 0, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        pricePerUnit: { type: 'number', minimum: 0 },
        timePerUnit: { type: 'number', minimum: 0 },
        unit: { type: 'string', minLength: 1, maxLength: 255 },
        internalNotes: { type: 'string', minLength: 1, maxLength: 255 },
    },
    required: [
        'internalCode',
        'description',
        'pricePerUnit',
        'timePerUnit',
        'unit',
        'internalNotes',
    ],
    additionalProperties: false,
};
//# sourceMappingURL=laborSchema.js.map