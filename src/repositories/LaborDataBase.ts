import { CreatedLaborDto } from '../dtos/labor/CreatedLaborDto';
import { PartialCreatedLabor } from '../types/Labor';
import queryCreator from './helpers/QueryCreator';
import { pool } from '../databases/DataBase/Pool';
import { IDataBase } from '../types/IDataBase';

class LaborDataBase implements IDataBase<CreatedLaborDto, PartialCreatedLabor> {
  private tableName;
  constructor() {
    this.tableName = 'labor';
  }

  async create(labor: CreatedLaborDto): Promise<void> {
    const query = queryCreator.insert(this.tableName, labor);

    await pool.query(query);
  }

  async hasWith(column: string, value: string): Promise<boolean> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      column,
      value
    );

    const result = await pool.query(query);

    return !(result.rows[0] === undefined);
  }

  async getAll(): Promise<CreatedLaborDto[]> {
    const query = queryCreator.selectByColumn(this.tableName, '*');

    const createdLabors = (await pool.query(query)).rows.map(
      (createdLabor) => new CreatedLaborDto(createdLabor)
    );

    return createdLabors;
  }

  async getOne(laborId: string): Promise<CreatedLaborDto> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      'id',
      laborId
    );

    return new CreatedLaborDto((await pool.query(query)).rows[0]);
  }

  async update(
    laborId: string,
    laborUpdates: PartialCreatedLabor
  ): Promise<void> {
    const query = queryCreator.update(
      this.tableName,
      laborUpdates,
      'id',
      laborId
    );

    await pool.query(query);
  }
}

export default new LaborDataBase();
export { LaborDataBase };
