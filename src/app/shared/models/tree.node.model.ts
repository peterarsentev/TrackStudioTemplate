export class TreeNodeModel {
  constructor(
    public name?: string,
    public hasChildren?: boolean,
    public taskId?: string,
    public parentId?: string,
    public children?: TreeNodeModel[]
  ) {
  }
}
