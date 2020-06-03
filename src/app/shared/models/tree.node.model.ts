export class TreeNodeModel {
  constructor(
    public id: string,
    public name?: string,
    public hasChildren?: boolean,
    public taskId?: string,
    public parentId?: string,
    public children?: TreeNodeModel[],
    public isExpandedField?: string,
    public expanded?: boolean
  ) {
  }
}
