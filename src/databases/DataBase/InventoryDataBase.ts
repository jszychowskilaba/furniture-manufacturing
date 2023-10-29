import { CreatedMaterial, PartialCreatedMaterial } from '../../types/Material';
import { CRUDOperations } from './helpers/CRUDOperations';
import { DataBase } from '../../types/DataBase';

class InventoryDataBase
  implements DataBase<CreatedMaterial, PartialCreatedMaterial>
{
  private operations: CRUDOperations<CreatedMaterial>;
  constructor() {
    this.operations = new CRUDOperations('material', 'id');
  }

  async create(material: CreatedMaterial): Promise<void> {
    await this.operations.create(material);
  }

  async hasWith(column: string, value: string): Promise<boolean> {
    return await this.operations.hasWith(column, value);
  }

  async getAll(): Promise<CreatedMaterial[]> {
    return await this.operations.getAll();
  }

  async getOne(materialId: string): Promise<CreatedMaterial> {
    return await this.operations.getOne(materialId);
  }

  async update(
    materialId: string,
    materialUpdates: PartialCreatedMaterial
  ): Promise<void> {
    await this.operations.update(materialId, materialUpdates);
  }
}

export default new InventoryDataBase();
