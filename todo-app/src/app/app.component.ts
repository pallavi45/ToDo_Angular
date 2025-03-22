import { Component, OnInit } from '@angular/core';
import { TasksService } from './pages/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'todo-app';
  company_logo_url='https://terralogic.com/wp-content/themes/terralogic/img/brand-logo.svg';
  todo_title:string='';
  todo_description:string='';
  todo_list_data:Array<any>=[];
  constructor(private _tasksSrvc: TasksService){}
  ngOnInit() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todo_list_data = JSON.parse(storedTodos);
    }
  }
  addToDoItem(){
    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      title: this.todo_title,
      description: this.todo_description,
    };
    this._tasksSrvc.addTodo(newTodo);
    this.todo_list_data.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(this.todo_list_data));
  } 
}
