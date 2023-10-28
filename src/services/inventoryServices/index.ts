import InventoryDataBase from '../../databases/DataBase/InventoryDataBase';
import { Material, CreatedMaterial } from '../../types/Material';
import { CreationStamp } from '../helpers/CreationStamp';
import { CustomError } from '../../helpers/CustomError';

class InventoryServices {
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

  async getAllMaterials(){
    const allMaterials = InventoryDataBase.getAllMaterials();
    return allMaterials;
  }
}

export default new InventoryServices();
