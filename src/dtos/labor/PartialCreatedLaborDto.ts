import { PartialCreatedLabor } from '../../types/Labor';

export class PartialCreatedLaborDto implements PartialCreatedLabor {
  constructor(partialLabor: PartialCreatedLabor) {
    for (const key in partialLabor) {
      if (partialLabor[key as keyof PartialCreatedLaborDto] !== undefined) {
        this[key as keyof PartialCreatedLaborDto] =
          partialLabor[key as keyof PartialCreatedLaborDto];
      }
    }
  }
}
