export interface ICRUDServices<T, CreatedT, PartialCreatedT> {
  create(
    data: T,
    username: string,
    column: string,
    value: string
  ): Promise<CreatedT>;
  getAll(): Promise<CreatedT[]>;
  getOne(dataId: string): Promise<CreatedT>;
  update(dataId: string, dataChanges: PartialCreatedT): Promise<CreatedT>;
}
