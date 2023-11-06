import { CreatedLabor, PartialCreatedLabor } from '../dto/Labor';
import { CRUDODataBase } from './helpers/CRUDODataBase';
import { IDataBase } from '../types/IDataBase';

class LaborDataBase implements IDataBase<CreatedLabor, PartialCreatedLabor> {
  private operations: CRUDODataBase<CreatedLabor>;
  constructor() {
    this.operations = new CRUDODataBase('labor', 'id');
  }

  async create(labor: CreatedLabor): Promise<void> {
    await this.operations.create(labor);
  }

  async hasWith(column: string, value: string): Promise<boolean> {
    return await this.operations.hasWith(column, value);
  }

  async getAll(): Promise<CreatedLabor[]> {
    return await this.operations.getAll();
  }

  async getOne(laborId: string): Promise<CreatedLabor> {
    return await this.operations.getOne(laborId);
  }

  async update(
    laborId: string,
    laborUpdates: PartialCreatedLabor
  ): Promise<void> {
    await this.operations.update(laborId, laborUpdates);
  }
}

export default new LaborDataBase();
