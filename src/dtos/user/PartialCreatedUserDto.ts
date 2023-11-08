import { PartialCreatedUser } from '../../types/User';

export class PartialCreatedUserDto implements PartialCreatedUser {
  constructor(partialUser: PartialCreatedUser) {
    for (const key in partialUser) {
      if (partialUser[key as keyof PartialCreatedUserDto] !== undefined) {
        this[key as keyof PartialCreatedUserDto] =
          partialUser[key as keyof PartialCreatedUserDto];
      }
    }
  }
}
