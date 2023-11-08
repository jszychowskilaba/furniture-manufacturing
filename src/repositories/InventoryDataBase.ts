import { CreatedMaterialDto } from '../dtos/inventory/CreatedMaterialDto';
import { PartialCreatedMaterial } from '../types/Material';
import queryCreator from './helpers/QueryCreator';
import { pool } from '../databases/DataBase/Pool';
import { IDataBase } from '../types/IDataBase';

class InventoryDataBase
  implements IDataBase<CreatedMaterialDto, PartialCreatedMaterial>
{
  private tableName: string;
  constructor() {
    this.tableName = 'material';
  }

  async create(material: CreatedMaterialDto): Promise<void> {
    const query = queryCreator.insert(this.tableName, material);
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

  async getAll(): Promise<CreatedMaterialDto[]> {
    const query = queryCreator.selectByColumn(this.tableName, '*');

    const createdMaterials = (await pool.query(query)).rows.map(
      (createdMaterial) => new CreatedMaterialDto(createdMaterial)
    );

    return createdMaterials;
  }

  async getOne(materialId: string): Promise<CreatedMaterialDto> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      'id',
      materialId
    );

    return new CreatedMaterialDto((await pool.query(query)).rows[0]);
  }

  async update(
    materialId: string,
    materialUpdates: PartialCreatedMaterial
  ): Promise<void> {
    const query = queryCreator.update(
      this.tableName,
      materialUpdates,
      'id',
      materialId
    );

    await pool.query(query);
  }
}

export default new InventoryDataBase();
