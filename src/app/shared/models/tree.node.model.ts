export class TreeNodeModel {
  constructor(
    public name?: string,
    public hasChildren?: boolean,
    public taskId?: string,
    public children?: TreeNodeModel[]
  ) {
  }
}
