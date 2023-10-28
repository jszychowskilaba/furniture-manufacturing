export class UpdateStamp {
  public updatedAt;
  constructor() {
    this.updatedAt = new Date().toISOString();
  }
}
