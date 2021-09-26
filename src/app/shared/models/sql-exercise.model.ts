export class SqlTopic {
  constructor(public id: number,
              public title: string,
              public position: number,
              public total: number = 0,
              public solved: number = 0) {
  }
}

export class SqlExercise {
  constructor(public id: number,
              public title: string,
              public description: string,
              public topicId: number,
              public scheme: string,
              public initScript: string,
              public answerScript: string,
              public position: number, public status: string) {
  }
}

export class SqlResult {
  constructor(
    public equal: boolean,
    public message: string
  ) {}
}

export class SqlSolution {
  constructor(public id: number,
              public exerciseId: number,
              public authorId: number,
              public solution: string,
              public status: string) {}
}
