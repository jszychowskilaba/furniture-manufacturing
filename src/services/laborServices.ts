import { PartialCreatedLaborDto } from '../dtos/labor/PartialCreatedLaborDto';
import { PartialLaborDto } from '../dtos/labor/PartialLaborDto';
import { CreatedLaborDto } from '../dtos/labor/CreatedLaborDto';
import { LaborDto } from '../dtos/labor/LaborDto';
import laborDataBase, { LaborDataBase } from '../repositories/LaborDataBase';
import { CreationStamp } from './helpers/CreationStamp';
import { CustomError } from '../helpers/CustomError';
import { UpdateStamp } from './helpers/UpdateStamp';
import { IService } from '../types/IService';

class LaborServices
  implements IService<LaborDto, CreatedLaborDto, PartialLaborDto>
{
  private laborDataBase: LaborDataBase;

  constructor(laborDataBase: LaborDataBase) {
    this.laborDataBase = laborDataBase;
  }

  async create(labor: LaborDto, username: string): Promise<CreatedLaborDto> {
    if (await this.laborDataBase.hasWith('internalCode', labor.internalCode)) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdLaborDto = new CreatedLaborDto({
      ...new CreationStamp(username),
      ...labor,
    });

    await this.laborDataBase.create(createdLaborDto);

    return createdLaborDto;
  }

  async getAll(): Promise<CreatedLaborDto[]> {
    const allLabors: CreatedLaborDto[] = await this.laborDataBase.getAll();
    return allLabors;
  }

  async getByQuery(queryParams: object): Promise<CreatedLaborDto[]> {
    const filteredLabors: CreatedLaborDto[] =
      await this.laborDataBase.getByQuery(queryParams);
    return filteredLabors;
  }

  async getOne(laborId: string): Promise<CreatedLaborDto> {
    const data: CreatedLaborDto = await this.laborDataBase.getOne(laborId);

    return data;
  }

  async update(
    laborId: string,
    laborChanges: PartialLaborDto
  ): Promise<CreatedLaborDto> {
    await this.getOne(laborId); // Throws error if data not exists

    const dataUpdatesDto = new PartialCreatedLaborDto({
      ...laborChanges,
      ...new UpdateStamp(),
    });

    await this.laborDataBase.update(laborId, dataUpdatesDto);
    return this.getOne(laborId);
  }
}

export default new LaborServices(laborDataBase);
export { LaborServices };
