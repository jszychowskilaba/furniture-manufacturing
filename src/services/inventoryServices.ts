import { PartialCreatedMaterialDto } from '../dtos/inventory/PartialCreatedMaterialDto';
import { CreatedMaterialDto } from '../dtos/inventory/CreatedMaterialDto';
import { PartialMaterialDto } from '../dtos/inventory/PartialMaterialDto';
import { MaterialDto } from '../dtos/inventory/MaterialDto';
import { InventoryDataBase } from '../repositories/InventoryDataBase';
import inventoryDatabase from '../repositories/InventoryDataBase';
import { CreatedMaterial, PartialCreatedMaterial } from '../types/Material';
import { CreationStamp } from './helpers/CreationStamp';
import { CustomError } from '../helpers/CustomError';
import { UpdateStamp } from './helpers/UpdateStamp';
import { IService } from '../types/IService';

class InventoryServices
  implements IService<MaterialDto, CreatedMaterialDto, PartialMaterialDto>
{
  private inventoryDatabase: InventoryDataBase;

  constructor(inventoryDataBase: InventoryDataBase) {
    this.inventoryDatabase = inventoryDataBase;
  }

  async create(
    material: MaterialDto,
    username: string
  ): Promise<CreatedMaterialDto> {
    if (
      await this.inventoryDatabase.hasWith(
        'internalCode',
        material.internalCode
      )
    ) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdMaterial: CreatedMaterial = {
      ...new CreationStamp(username),
      ...material,
    };

    await this.inventoryDatabase.create(
      new CreatedMaterialDto(createdMaterial)
    );

    return createdMaterial;
  }

  async getAll(): Promise<CreatedMaterialDto[]> {
    const allMaterials: CreatedMaterialDto[] =
      await this.inventoryDatabase.getAll();
    return allMaterials;
  }

  async getOne(materialId: string): Promise<CreatedMaterialDto> {
    const data: CreatedMaterialDto = await this.inventoryDatabase.getOne(
      materialId
    );

    if (!data) throw new CustomError('Data not found', 404);

    return data;
  }

  async update(
    materialId: string,
    materialChanges: PartialMaterialDto
  ): Promise<CreatedMaterialDto> {
    await this.getOne(materialId); // Throws error if data not exists

    const dataUpdates: PartialCreatedMaterial = {
      ...materialChanges,
      ...new UpdateStamp(),
    };

    await this.inventoryDatabase.update(
      materialId,
      new PartialCreatedMaterialDto(dataUpdates)
    );
    return this.getOne(materialId);
  }
}

export default new InventoryServices(inventoryDatabase);
