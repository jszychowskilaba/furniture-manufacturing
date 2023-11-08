import { CreatedLabor } from '../../types/Labor';

export class CreatedLaborDto implements CreatedLabor {
  status: 'active' | 'inactive';
  internalCode: string;
  description: string;
  pricePerUnit: number;
  timePerUnit: number;
  unit: string;
  internalNotes: string;
  createdAt: string | Date;
  updatedAt: string;
  id: string;
  username: string;

  constructor(labor: CreatedLabor) {
    this.status = labor.status;
    this.internalCode = labor.internalCode;
    this.description = labor.description;
    this.pricePerUnit = labor.pricePerUnit;
    this.timePerUnit = labor.timePerUnit;
    this.unit = labor.unit;
    this.internalNotes = labor.internalNotes;
    this.createdAt = labor.createdAt;
    this.updatedAt = labor.updatedAt;
    this.id = labor.id;
    this.username = labor.username;
  }
}
