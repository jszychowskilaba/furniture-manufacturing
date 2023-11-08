import { PartialUser } from '../../types/User';

export class PartialUserDto implements PartialUser {
  constructor(partialUser: PartialUser) {
    for (const key in partialUser) {
      if (partialUser[key as keyof PartialUserDto] !== undefined) {
        this[key as keyof PartialUserDto] =
          partialUser[key as keyof PartialUserDto];
      }
    }
  }
}
