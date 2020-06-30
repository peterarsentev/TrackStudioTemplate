import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { Qopt } from '../models/qopt.model';
import { Answer } from '../models/answer.model';
import { Aopt } from '../models/aopt.model';

@Injectable({
  providedIn: 'root'
})
export class ExamstorageService {

  constructor() { }

  public examid: number;
  public examuserid: number;
  public userid: number;
  public questions: Question[];
  public qopts: Qopt[];
  public answers: Answer[];
  public aopts: Aopt[];

}
