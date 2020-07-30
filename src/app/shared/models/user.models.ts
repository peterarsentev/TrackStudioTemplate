export class UserModels {
  constructor(
    public preferences?: string,
    public string?: string,
    public timezone?: string,
    public managerId?: string,
    public locale?: string,
    public login?: string,
    public passwordChangedDate?: number,
    public defaultProjectId?: string,
    public enabled?: boolean,
    public name?: string,
    public childAllowed?: number,
    public expireDate?: number,
    public  id?: string,
    public prstatusId?: string,
    public lastLogonDate?: number,
    public email?: string,

    // edu

  public pwd?: string,
  ) {
  }
}
