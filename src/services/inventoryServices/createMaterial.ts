import { Material, Error } from '../../types/types';
import { getCurrentISODate } from '../utils/getCurrentISODate';
import { throwError } from '../../utils/throwError';

interface CreatedMaterial extends Material {
  createdAt: string;
  updatedAt: string;
  userID: string;
}

export const createMaterial = (material: Material) => {
  try {
    // Create DB code

    // Check if material exist in DB
    const materialExists = 0;
    if (materialExists) throwError(409, 'Material already exists.');

    // Store material in DB. Make logic for obtaining userID
    const date = getCurrentISODate();
    const createdMaterial: CreatedMaterial = {
      ...material,
      createdAt: date,
      updatedAt: date,
      userID: 'jose.id',
    };

    return createdMaterial;
  } catch (e) {
    const error: Error = {
      status: (e as Error).status || 500,
      message:
        (e as Error).message || 'Unexpected error in createMaterial service.',
    };
    throw error;
  }
};
