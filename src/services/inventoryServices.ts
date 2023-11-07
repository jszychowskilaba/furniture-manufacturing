import { CreatedMaterialDto } from '../dtos/inventory/CreatedMaterialDto';
import { PartialMaterialDto } from '../dtos/inventory/PartialMaterialDto';
import { MaterialDto } from '../dtos/inventory/PartialCreatedMaterial';
import inventoryDataBase from '../repositories/InventoryDataBase';
import { CreationStamp } from './helpers/CreationStamp';
import { CustomError } from '../helpers/CustomError';
import { UpdateStamp } from './helpers/UpdateStamp';
import { IService } from '../types/IService';

class InventoryServices
  implements IService<MaterialDto, CreatedMaterialDto, PartialMaterialDto>
{
  async create(
    material: MaterialDto,
    username: string
  ): Promise<CreatedMaterialDto> {
    if (
      await inventoryDataBase.hasWith('internalCode', material.internalCode)
    ) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdMaterial = {
      ...new CreationStamp(username),
      ...material,
    };

    await inventoryDataBase.create(new CreatedMaterialDto(createdMaterial));

    return createdMaterial;
  }

  async getAll(): Promise<CreatedMaterialDto[]> {
    const allMaterials: CreatedMaterialDto[] = await inventoryDataBase.getAll();
    return allMaterials;
  }

  async getOne(materialId: string): Promise<CreatedMaterialDto> {
    const data: CreatedMaterialDto = await inventoryDataBase.getOne(materialId);

    if (!data) throw new CustomError('Data not found', 404);

    return data;
  }

  async update(
    materialId: string,
    materialChanges: PartialMaterialDto
  ): Promise<CreatedMaterialDto> {
    await this.getOne(materialId); // Throws error if data not exists

    const dataUpdates = {
      ...materialChanges,
      ...new UpdateStamp(),
    };

    await inventoryDataBase.update(materialId, dataUpdates);
    return this.getOne(materialId);
  }
}

export default new InventoryServices();
