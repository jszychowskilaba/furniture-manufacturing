import { PartialCreatedMaterialDto } from '../dtos/inventory/PartialCreatedMaterialDto';
import { CreatedMaterialDto } from '../dtos/inventory/CreatedMaterialDto';
import { PartialMaterialDto } from '../dtos/inventory/PartialMaterialDto';
import { MaterialDto } from '../dtos/inventory/MaterialDto';
import { InventoryDataBase } from '../repositories/InventoryDataBase';
import inventoryDatabase from '../repositories/InventoryDataBase';
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

    const createdMaterialDto = new CreatedMaterialDto({
      ...new CreationStamp(username),
      ...material,
    });

    await this.inventoryDatabase.create(createdMaterialDto);

    return createdMaterialDto;
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

    return data;
  }

  async update(
    materialId: string,
    materialChanges: PartialMaterialDto
  ): Promise<CreatedMaterialDto> {
    await this.getOne(materialId); // Throws error if data not exists

    const dataUpdatesDto = new PartialCreatedMaterialDto({
      ...materialChanges,
      ...new UpdateStamp(),
    });

    await this.inventoryDatabase.update(materialId, dataUpdatesDto);
    return this.getOne(materialId);
  }
}

export default new InventoryServices(inventoryDatabase);
export { InventoryServices };
