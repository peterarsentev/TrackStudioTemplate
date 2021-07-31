export class RateModel {
  constructor(
    public down?: number,
    public id?: number,
    public taskId?: number,
    public up?: number,
    public vote?: string,
  ) {
  }
}
