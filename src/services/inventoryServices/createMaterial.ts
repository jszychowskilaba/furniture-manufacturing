import { Material } from '../../types/types';
import { getCurrentISODate } from '../utils/getCurrentISODate';
import { CustomError } from '../../helpers/CustomError';
import { v4 as uuid } from 'uuid';

interface CreatedMaterial extends Material {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

export const createMaterial = (material: Material, username: string) => {
  // Create DB code

  // Check if material exist in DB
  const materialExists = 0;
  if (materialExists) throw new CustomError('Material already exists.', 409);

  // Store material in DB
  const date = getCurrentISODate();
  const createdMaterial: CreatedMaterial = {
    id: uuid(),
    createdAt: date,
    updatedAt: date,
    ...material,
    username: username,
  };

  return createdMaterial;
};
