export interface IService<T, CreatedT, PartialT> {
  create(data: T, username: string): Promise<CreatedT>;
  getAll(): Promise<CreatedT[]>;
  getAll(): Promise<CreatedT[]>;
  getOne(dataId: string): Promise<CreatedT>;
  update(materialId: string, materialChanges: PartialT): Promise<CreatedT>;
}

