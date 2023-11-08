import { PartialMaterial } from '../../types/Material';

export class PartialMaterialDto implements PartialMaterial {
  constructor(partialMaterial: PartialMaterial) {
    for (const key in partialMaterial) {
      if (partialMaterial[key as keyof PartialMaterialDto] !== undefined) {
        this[key as keyof PartialMaterialDto] =
          partialMaterial[key as keyof PartialMaterialDto];
      }
    }
  }
}
