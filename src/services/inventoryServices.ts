import InventoryDataBase from '../repositories/InventoryDataBase';
import { Material, CreatedMaterial, PartialMaterial } from '../types/Material';
import { ICRUDServices } from '../types/ICRUDServices';
import CRUDServices from './helpers/CRUDServices';
import { IService } from '../types/IService';

class InventoryServices
  implements IService<Material, CreatedMaterial, PartialMaterial>
{
  private crudServices: ICRUDServices<
    Material,
    CreatedMaterial,
    PartialMaterial
  >;

  constructor() {
    this.crudServices = new CRUDServices(InventoryDataBase);
  }

  async create(material: Material, username: string): Promise<CreatedMaterial> {
    return await this.crudServices.create(
      material,
      username,
      'internalCode',
      material.internalCode
    );
  }

  async getAll(): Promise<CreatedMaterial[]> {
    return await this.crudServices.getAll();
  }

  async getOne(materialId: string): Promise<CreatedMaterial> {
    return await this.crudServices.getOne(materialId);
  }

  async update(
    materialId: string,
    materialChanges: PartialMaterial
  ): Promise<CreatedMaterial> {
    return await this.crudServices.update(materialId, materialChanges);
  }
}

export default new InventoryServices();
