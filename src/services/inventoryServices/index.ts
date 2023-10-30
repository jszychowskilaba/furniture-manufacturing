import InventoryDataBase from '../../databases/DataBase/InventoryDataBase';
import {
  Material,
  CreatedMaterial,
  PartialMaterial,
} from '../../types/Material';
import { ICRUDServices } from '../../types/ICRUDServices';
import CRUDServices from '../helpers/CRUDServices';

class InventoryServices {
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
