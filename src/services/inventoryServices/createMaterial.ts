import { Material } from '../../types/types';
import { getCurrentISODate } from '../utils/getCurrentISODate';
import { throwError } from '../../utils/throwError';

interface CreatedMaterial extends Material {
  createdAt: string;
  updatedAt: string;
  username: string;
}

export const createMaterial = (material: Material, username: string) => {
  // Create DB code

  // Check if material exist in DB
  const materialExists = 0;
  if (materialExists) throwError('Material already exists.', 409);

  // Store material in DB
  const date = getCurrentISODate();
  const createdMaterial: CreatedMaterial = {
    ...material,
    createdAt: date,
    updatedAt: date,
    username: username,
  };

  return createdMaterial;
};
