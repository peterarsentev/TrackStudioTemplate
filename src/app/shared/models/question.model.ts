import { ExamModels } from './exam.models';


export class Question {

  constructor(
    public id?: number,
    public exam?: ExamModels,
    public name?: string,
    public description?: string,
    public pos?: number,
    public hint?: string
  ) {
  }

}

//   id          serial primary key,
//   exam_id     int references exam (id),
//   name        varchar(255)  not null,
//   description varchar(3000) not null,
//   pos         int default 0,
//   hint        varchar(3000) not null
