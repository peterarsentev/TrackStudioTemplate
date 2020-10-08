export class CommentAndButtonsModel {
  constructor(
    public saveAndUp?: boolean,
    public close?: boolean,
    public saveAndNext?: boolean,
    public save?: boolean,
    public handlerId?: string,
    public description?: string
  ) {
  }
}
