import { CreatedMaterial, PartialCreatedMaterial } from '../../types/Material';
import { CRUDOperations } from './helpers/CRUDOperations';

class InventoryDataBase {
  private operations: CRUDOperations<CreatedMaterial>;
  constructor() {
    this.operations = new CRUDOperations('material', 'id');
  }

  async createMaterial(material: CreatedMaterial): Promise<void> {
    await this.operations.create(material);
  }

  async hasMaterialWith(column: string, value: string): Promise<boolean> {
    return await this.operations.hasDataWith(column, value);
  }

  async getAllMaterials(): Promise<CreatedMaterial[]> {
    return await this.operations.getAllData();
  }

  async getOneMaterial(materialId: string): Promise<CreatedMaterial> {
    return await this.operations.getOneData(materialId);
  }

  async updateMaterial(
    materialId: string,
    materialUpdates: PartialCreatedMaterial
  ): Promise<void> {
    await this.operations.updateData(materialId, materialUpdates);
  }
}

export default new InventoryDataBase();
