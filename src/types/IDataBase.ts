export interface IDataBase<CreatedT, PartialCreatedT> {
    create(material: CreatedT): Promise<void>;
    hasWith(column: string, value: string): Promise<boolean>;
    getAll(): Promise<CreatedT[]>;
    getOne(dataId: string): Promise<CreatedT>;
    update(
      dataId: string,
      dataUpdates: PartialCreatedT
    ): Promise<void>;
  }