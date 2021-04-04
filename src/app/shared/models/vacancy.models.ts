
export class VacancyModels {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public open?: boolean,
    public authorId?: string,
    public authorName?: string,
    public created?: number,
    public updated?: number,
    public sessionId?: string,
  ) {
  }
}
