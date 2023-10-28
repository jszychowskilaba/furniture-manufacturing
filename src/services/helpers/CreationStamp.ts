import { v4 as uuid } from 'uuid';
import { ICreationStamp } from '../../types/types';

export class CreationStamp implements ICreationStamp{
  public id: string;
  public createdAt: string;
  public updatedAt: string;
  public username: string;

  constructor(username: string) {
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    this.id = uuid();
    this.username = username;
  }
}
