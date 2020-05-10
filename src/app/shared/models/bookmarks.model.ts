export class BookmarksModel {
  constructor(
    public createdate?: number,
    public id?: string,
    public name?:string,
    public ownerId?: string,
    public taskId?: string
  ) {
  }
}
