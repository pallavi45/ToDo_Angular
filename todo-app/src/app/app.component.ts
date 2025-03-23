import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TasksService } from './pages/tasks.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'todo-app';
  company_logo_url='https://terralogic.com/wp-content/themes/terralogic/img/brand-logo.svg';
  user_profile_img='/assets/user_profile.png'
  todo_title:any='';
  todo_description:string='';
  todo_list_data:Array<any>=[];
  constructor(private _tasksSrvc: TasksService,private modalSrv:NgbModal){}
  ngOnInit() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todo_list_data = JSON.parse(storedTodos);
    }
  }
  addItemModal(addtoDoItemModal:any){
    this.modalSrv.open(addtoDoItemModal,{
      size:'md',
      backdrop:'static'
    })
  }
  addToDoItem() {
    if (!this.todo_title?.trim() || !this.todo_description?.trim()) {
      Swal.fire('Warning',"Please add title and description to add to-do item","warning");
      return;
    }
    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      title: this.todo_title.trim(),
      description: this.todo_description.trim(),
    };
  
    this._tasksSrvc.addTodo(newTodo);
    this.todo_list_data.push(newTodo);
    this.modalSrv.dismissAll();
    localStorage.setItem("todos", JSON.stringify(this.todo_list_data));
  
    this.todo_title = "";
    this.todo_description = "";
  }
  
}
