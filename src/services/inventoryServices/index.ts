import InventoryDataBase from '../../databases/DataBase/InventoryDataBase';
import { Material, CreatedMaterial } from '../../types/Material';
import { CreationStamp } from '../helpers/CreationStamp';
import { CustomError } from '../../helpers/CustomError';

class InventoryServices {
  /**
   * Creates a new material and stores it in database
   * @param material The material to create
   * @param username The user material creator username
   * @returns The created material
   */
  async createMaterial(
    material: Material,
    username: string
  ): Promise<CreatedMaterial> {
    if (
      await InventoryDataBase.hasMaterialWith(
        'internalCode',
        material.internalCode
      )
    ) {
      throw new CustomError(
        'Material with same internal code already exists',
        409
      );
    }

    const createdMaterial: CreatedMaterial = {
      ...new CreationStamp(username),
      ...material,
    };

    await InventoryDataBase.createMaterial(createdMaterial);

    return createdMaterial;
  }

  /**
   * Get all stored materials in the database
   * @returns The materials
   */
  async getAllMaterials(): Promise<CreatedMaterial[]> {
    const allMaterials = await InventoryDataBase.getAllMaterials();
    return allMaterials;
  }
}

export default new InventoryServices();
