import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {
  completedTodos: Array<any> = [];

  constructor(private _taskSrvc: TasksService) {}

  ngOnInit(): void {
    this._taskSrvc.getCompletedTodosObservable().subscribe((todos:any) => {
      this.completedTodos = todos; // Show completed todos
    });
  }

  removeCompletedItem(id: string): void {
    this._taskSrvc.removeTodo(id, true);  // `true` because it's in the completed list
  }


  trackById(index: number, item: any): string {
    return item.id;
  }


}
