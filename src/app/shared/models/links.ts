export class Links {
  constructor(
    public author?: string,
    public solutions?: Sol[]
  ) {
  }
}


export class Sol {
  constructor(
    public links?: GitHub[],
    public time?: number
  ) {
  }
}

export class GitHub {
  constructor(
    public link?: string,
    public domain?: string,
    public rev?: string
  ) {
  }
}
