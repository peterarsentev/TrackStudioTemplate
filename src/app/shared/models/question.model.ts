import { ExamModels } from './exam.models';
import { Qopt } from './qopt.model';


export class Question {

  constructor(
    public exam?: ExamModels,
    public name?: string,
    public description?: string,
    public pos?: number,
    public hint?: string,
    public id?: number,
    public options?: Qopt[],
    public aopt?: number[]
  ) {
  }

}

//   id          serial primary key,
//   exam_id     int references exam (id),
//   name        varchar(255)  not null,
//   description varchar(3000) not null,
//   pos         int default 0,
//   hint        varchar(3000) not null
