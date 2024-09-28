/**
 * val id: Int, val roleId: Int, val key: PermissionRule, val value: Int?
 */
export class RuleModels {
  constructor(
    public id?: number,
    public roleId?: number,
    public key?: string,
    public value?: number
  ) {
  }
}
