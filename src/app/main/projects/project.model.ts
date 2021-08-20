export class ProjectModel {
  constructor(
    public id?: number,
    public name?: string,
    public userId?: number,
    public link?: string,
    public log?: string,
    public status?: number,
    public created?: number
  ) {
  }
}
