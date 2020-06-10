import { Answer } from './answer.model';
import { Qopt } from './qopt.model';

export class Aopt {

  constructor(
    public id?: number,
    public answer?: Answer,
    public opt?: Qopt
  ) {
  }
}
