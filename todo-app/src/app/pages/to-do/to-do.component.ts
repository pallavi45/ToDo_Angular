import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {
  addedTodoListItems:Array<any>=[];
  constructor(private _tasksSrvc:TasksService,private cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    const storedTodos = localStorage.getItem('todos');
    this._tasksSrvc.getTodosObservable().subscribe(todos => {
      this.addedTodoListItems = todos; 
    });
  }
  removeToDoItem(id:any){
    console.log(id)
  }
  trackById(index: number, item: any): string {
    return item.id;
  }
  editToDoItem(id: string): void {
    const todo = this.addedTodoListItems.find(item => item.id === id);
    if (todo) {
      todo.isEditing = !todo.isEditing;  // Toggle the editing state
    }
  }

  saveToDoItem(id: string, newTitle: string, newDescription: string): void {
    const todo = this.addedTodoListItems.find(item => item.id === id);
    if (todo) {
      todo.title = newTitle;  
      todo.description = newDescription;
      todo.isEditing = false;  // Exit edit mode
      this._tasksSrvc.updateTodo(todo);  // Update the todo in the service (which also updates localStorage)
    }
  }
  toggleCompleted(id: string): void {
    const todo = this.addedTodoListItems.find(item => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;  // Toggle the 'completed' status
      this._tasksSrvc.updateTodo(todo);  // Update the todo in the service
    }
  }
  completeToDoItem(id: string): void {
    this._tasksSrvc.completeTodo(id);  // This will remove from active and add to completed
  }
}   
