export class BookmarksModel {
  constructor(
    public createdate?: number,
    public id?: string,
    public name?: string,
    public link?: string,
    public userId?: string,
    public ownerId?: string,
    public taskId?: string
  ) {
  }
}
