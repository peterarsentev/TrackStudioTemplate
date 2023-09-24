export class PageModel<T> {
  constructor(
    public content?: T,
    public hasNext?: boolean
  ) {
  }
}
