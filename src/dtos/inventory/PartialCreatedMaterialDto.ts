import { PartialCreatedMaterial } from '../../types/Material';

export class PartialCreatedMaterialDto implements PartialCreatedMaterial {
  constructor(partialMaterial: PartialCreatedMaterial) {
    for (const key in partialMaterial) {
      if (
        partialMaterial[key as keyof PartialCreatedMaterialDto] !== undefined
      ) {
        this[key as keyof PartialCreatedMaterialDto] =
          partialMaterial[key as keyof PartialCreatedMaterialDto];
      }
    }
  }
}
