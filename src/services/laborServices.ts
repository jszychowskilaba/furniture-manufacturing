import LaborDataBase from '../repositories/LaborDataBase';
import { Labor, CreatedLabor, PartialLabor } from '../dto/Labor';
import { ICRUDServices } from '../types/ICRUDServices';
import CRUDServices from './helpers/CRUDServices';
import { IService } from '../types/IService';

class LaborServices implements IService<Labor, CreatedLabor, PartialLabor> {
  private crudServices: ICRUDServices<Labor, CreatedLabor, PartialLabor>;

  constructor() {
    this.crudServices = new CRUDServices(LaborDataBase);
  }

  async create(labor: Labor, username: string): Promise<CreatedLabor> {
    return await this.crudServices.create(
      labor,
      username,
      'internalCode',
      labor.internalCode
    );
  }

  async getAll(): Promise<CreatedLabor[]> {
    return await this.crudServices.getAll();
  }

  async getOne(laborId: string): Promise<CreatedLabor> {
    return await this.crudServices.getOne(laborId);
  }

  async update(
    laborId: string,
    laborChanges: PartialLabor
  ): Promise<CreatedLabor> {
    return await this.crudServices.update(laborId, laborChanges);
  }
}

export default new LaborServices();
