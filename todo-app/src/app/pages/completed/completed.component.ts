import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CompletedComponent implements OnInit {
  completedTodos: Array<any> = [];
  constructor(private _taskSrvc: TasksService) {}

  ngOnInit(): void {
    this._taskSrvc.getCompletedTodosObservable().subscribe((todos:any) => {
      this.completedTodos = todos; 
    });
  }

  removeCompletedItem(id: string): void {
    this._taskSrvc.removeTodo(id, true); 
  }

  trackById(index: number, item: any): string {
    return item.id;
  }

}
