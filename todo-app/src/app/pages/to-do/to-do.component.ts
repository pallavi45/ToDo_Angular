import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TasksService } from '../tasks.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ToDoComponent implements OnInit {
  addedTodoListItems:Array<any>=[];
  selectedItem:any={};
  swal=Swal.mixin({
    customClass:{
      confirmButton:'confirm_btn',
      cancelButton:'btn btn-danger',
      input:'top-checkbox'
    }
  })
  constructor(private _tasksSrvc:TasksService,private modalSrvc:NgbModal,private cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    const storedTodos = localStorage.getItem('todos');
    this._tasksSrvc.getTodosObservable().subscribe(todos => {
      this.addedTodoListItems = todos; 
    });
  }
  removeToDoItem(id:any){
    this.swal.fire({
      title:'Are you sure to delete this task',
      icon: 'question',
      input:'checkbox',
      inputPlaceholder:'Delete this task',
      showConfirmButton:true,
      showCancelButton:true,
      confirmButtonText:'Delete',
      cancelButtonText:'Cancel',
      allowOutsideClick:false,
      didOpen() {
        const confirmButton:any = Swal.getConfirmButton();
        confirmButton.disabled = true;
    
        Swal.getInput()?.addEventListener('change', (event: Event) => {
          const checkbox = event.target as HTMLInputElement;
          confirmButton.disabled = !checkbox.checked; 
        });
      },
  }).then((result:any)=>{
      if(result.dismiss){
        Swal.close();
      }else if(!result.dismiss){
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,text: 'Task Deleted Succesfully', icon: 'success', })
        .then(()=>{
          this.addedTodoListItems = this.addedTodoListItems.filter(item => item.id !== id);
          localStorage.setItem('todos', JSON.stringify(this.addedTodoListItems));
          this._tasksSrvc.updateTodo(this.addedTodoListItems); 
        })
      }
    })
  }
  trackById(index: number, item: any): string {
    return item.id;
  }
  editToDoItem(id: string): void {
    const todo = this.addedTodoListItems.find(item => item.id === id);
    if (todo) {
      todo.isEditing = !todo.isEditing;
    }
  }

  saveToDoItem(id: string, newTitle: string, newDescription: string): void {
    const todo = this.addedTodoListItems.find(item => item.id === id);
    if (todo) {
      todo.title = newTitle;  
      todo.description = newDescription;
      todo.isEditing = false; 
      this._tasksSrvc.updateTodo(todo); 
    }
  }
  toggleCompleted(id: string): void {
    const todo = this.addedTodoListItems.find(item => item.id === id);
    if (todo) {
      todo.completed = !todo.completed; 
      this._tasksSrvc.updateTodo(todo);
    }
  }
  openEditModal(editToDoItemModal:any,item: any) {
    this.selectedItem = { ...item };
    this.modalSrvc.open(editToDoItemModal,{
      size:'md',
      backdrop:'static'
    })
  }

  updateToDoItem() {
    let index = this.addedTodoListItems.findIndex(todo => todo.id === this.selectedItem.id);
    if (index !== -1) {
      this.addedTodoListItems[index] = { ...this.selectedItem };
      this._tasksSrvc.updateTodo(this.selectedItem ); 
    }
    this.modalSrvc.dismissAll();
  }
  completeToDoItem(event:any,id: string) {
    const checkbox = event.target as HTMLInputElement;
    if(checkbox.checked){
      this.swal.fire({
        title:'Are you sure to mark this task as completed',
        icon: 'question',
        input:'checkbox',
        inputPlaceholder:'Mark this task as completed',
        showConfirmButton:true,
        showCancelButton:true,
        confirmButtonText:'Mark as Completed',
        cancelButtonText:'Cancel',
        allowOutsideClick:false,
        didOpen() {
          const confirmButton:any = Swal.getConfirmButton();
          confirmButton.disabled = true;
      
          Swal.getInput()?.addEventListener('change', (event: Event) => {
            const checkbox = event.target as HTMLInputElement;
            confirmButton.disabled = !checkbox.checked; 
          });
        },
      }).then((result:any)=>{
        if(result.dismiss){
          Swal.close();
        }else if(!result.dismiss){
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,text: 'Task Completed Succesfully', icon: 'success', })
          .then(()=>{
            this._tasksSrvc.completeTodo(id); 
          })
        }
      })
    }
  }
}   
