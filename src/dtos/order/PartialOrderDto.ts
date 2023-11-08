import { PartialOrder } from '../../types/Order';

export class PartialOrderDto implements PartialOrder {
  constructor(partialOrder: PartialOrder) {
    for (const key in partialOrder) {
      if (partialOrder[key as keyof PartialOrderDto] !== undefined) {
        this[key as keyof PartialOrderDto] =
          partialOrder[key as keyof PartialOrderDto];
      }
    }
  }
}
