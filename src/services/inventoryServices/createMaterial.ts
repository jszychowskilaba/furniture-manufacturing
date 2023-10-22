import { Material, Error } from '../../types/types';
import { getCurrentISODate } from '../utils/getCurrentISODate';
import { throwError } from '../../utils/throwError';

interface CreatedMaterial extends Material {
  createdAt: string;
  updatedAt: string;
  username: string;
}

export const createMaterial = (material: Material, username: string) => {
  try {
    // Create DB code

    // Check if material exist in DB
    const materialExists = 0;
    if (materialExists) throwError(409, 'Material already exists.');

    // Store material in DB
    const date = getCurrentISODate();
    const createdMaterial: CreatedMaterial = {
      ...material,
      createdAt: date,
      updatedAt: date,
      username: username,
    };

    return createdMaterial;
  } catch (e) {
    throwError(
      (e as Error).status || 500,
      (e as Error).message || `Unexpected error in createMaterial service. ${e}`
    );
  }
};
