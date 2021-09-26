import {Injectable} from '@angular/core';
import {SqlExercise} from '../../shared/models/sql-exercise.model';

@Injectable({
  providedIn: 'root'
})
export class PrevNextService {

  private exercises: SqlExercise[] = [];

  public setUpData(exercises: SqlExercise[]) {
    this.exercises = exercises;
  }

  public getPrevNextIds(id: number): {prevId: number | null, nextId: number | null} {
    const currentIndex = this.exercises.findIndex(el => el.id === id);
    if (currentIndex === -1) {
      return {prevId: null, nextId: null};
    }
    const prevId = currentIndex - 1 < 0 ? null : this.exercises[currentIndex - 1].id;
    const nextId = currentIndex + 1 >= this.exercises.length ? null : this.exercises[currentIndex + 1].id;
    return {prevId, nextId};
  }

}
