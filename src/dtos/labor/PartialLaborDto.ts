import { PartialLabor } from '../../types/Labor';

export class PartialLaborDto implements PartialLabor {
  constructor(partialLabor: PartialLabor) {
    for (const key in partialLabor) {
      if (partialLabor[key as keyof PartialLaborDto] !== undefined) {
        this[key as keyof PartialLaborDto] =
          partialLabor[key as keyof PartialLaborDto];
      }
    }
  }
}
