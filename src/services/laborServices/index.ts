import InventoryDataBase from '../../databases/DataBase/LaborDataBase';
import {
  Labor,
  CreatedLabor,
  PartialLabor,
  PartialCreatedLabor,
} from '../../types/Labor';
import { CreationStamp } from '../helpers/CreationStamp';
import { CustomError } from '../../helpers/CustomError';
import { UpdateStamp } from '../helpers/UpdateStamp';

class InventoryServices {
  /**
   * Creates a new labor and stores it in database
   * @param labor The labor to create
   * @param username The user labor creator username
   * @returns The created labor
   */
  async createLabor(
    labor: Labor,
    username: string
  ): Promise<CreatedLabor> {
    if (
      await InventoryDataBase.hasLaborWith(
        'internalCode',
        labor.internalCode
      )
    ) {
      throw new CustomError(
        'Labor with same internal code already exists',
        409
      );
    }

    const createdLabor: CreatedLabor = {
      ...new CreationStamp(username),
      ...labor,
    };

    await InventoryDataBase.createLabor(createdLabor);

    return createdLabor;
  }

  /**
   * Get all stored labors in the database
   * @returns The labors
   */
  async getAllLabors(): Promise<CreatedLabor[]> {
    const allLabors = await InventoryDataBase.getAllLabors();
    return allLabors;
  }

  /**
   * Get one labor from the database given a labor Id
   * @param laborId The labor Id
   * @returns The labor
   */
  async getOneLabor(laborId: string): Promise<CreatedLabor> {
    const labor = await InventoryDataBase.getOneLabor(laborId);

    if (!labor) throw new CustomError('Labor not found', 404);

    return labor;
  }

  /**
   * Updates labor in database given a object with updates.
   * @param laborId The labor Id to updated
   * @param laborChanges The object with updates
   * @returns The updated labor
   */
  async updateLabor(
    laborId: string,
    laborChanges: PartialLabor
  ): Promise<CreatedLabor> {
    await this.getOneLabor(laborId); // Throws error if labor not exists

    const laborUpdates: PartialCreatedLabor = {
      ...laborChanges,
      ...new UpdateStamp(),
    };

    await InventoryDataBase.updateLabor(laborId, laborUpdates);
    return this.getOneLabor(laborId);
  }
}

export default new InventoryServices();
