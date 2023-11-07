import { PartialLaborDto } from '../dtos/labor/PartialLaborDto';
import { CreatedLaborDto } from '../dtos/labor/CreatedLaborDto';
import laborDataBase from '../repositories/LaborDataBase';
import { CreationStamp } from './helpers/CreationStamp';
import { CustomError } from '../helpers/CustomError';
import { UpdateStamp } from './helpers/UpdateStamp';
import { LaborDto } from '../dtos/labor/LaborDto';
import { IService } from '../types/IService';

class LaborServices
  implements IService<LaborDto, CreatedLaborDto, PartialLaborDto>
{
  async create(labor: LaborDto, username: string): Promise<CreatedLaborDto> {
    if (await laborDataBase.hasWith('internalCode', labor.internalCode)) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdLabor = {
      ...new CreationStamp(username),
      ...labor,
    };

    await laborDataBase.create(new CreatedLaborDto(createdLabor));

    return createdLabor;
  }

  async getAll(): Promise<CreatedLaborDto[]> {
    const allLabors: CreatedLaborDto[] = await laborDataBase.getAll();
    return allLabors;
  }

  async getOne(laborId: string): Promise<CreatedLaborDto> {
    const data: CreatedLaborDto = await laborDataBase.getOne(laborId);

    if (!data) throw new CustomError('Data not found', 404);

    return data;
  }

  async update(
    laborId: string,
    laborChanges: PartialLaborDto
  ): Promise<CreatedLaborDto> {
    await this.getOne(laborId); // Throws error if data not exists

    const dataUpdates = {
      ...laborChanges,
      ...new UpdateStamp(),
    };

    await laborDataBase.update(laborId, dataUpdates);
    return this.getOne(laborId);
  }
}

export default new LaborServices();
