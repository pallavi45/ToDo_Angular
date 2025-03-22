import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private todosSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(this.getTodos());
  private completedTodosSubject = new BehaviorSubject<any[]>([]);  // Completed Todos
  constructor() { 
    const storedTodos = localStorage.getItem('todos');
    const storedCompletedTodos = localStorage.getItem('completedTodos');
    if (storedTodos) {
      this.todosSubject.next(JSON.parse(storedTodos));
    }
    if (storedCompletedTodos) {
      this.completedTodosSubject.next(JSON.parse(storedCompletedTodos));
    }
  }
  getTodos(): Array<any> {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  }
  getTodosObservable() {
    return this.todosSubject.asObservable();
  }
  getCompletedTodosObservable() {
    return this.completedTodosSubject.asObservable();
  }
  // Add new ToDo item to the list
  addTodo(newTodo: any): void {
    const todosList = this.getTodos();
    todosList.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todosList));
    this.todosSubject.next(todosList)
  }
  updateTodo(updatedTodo: any) {
    const todos = this.getTodos();
    const index = todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      todos[index] = updatedTodo; 
      localStorage.setItem('todos', JSON.stringify(todos));
      this.todosSubject.next(todos); 
    }
  }
  completeTodo(id: string) {
    const currentTodos = this.todosSubject.getValue();
    const completedTodos = this.completedTodosSubject.getValue();

    const todoIndex = currentTodos.findIndex(item => item.id === id);
    if (todoIndex !== -1) {
      const [completedTodo] = currentTodos.splice(todoIndex, 1);
      completedTodo.completed = true;  // Mark as completed
      completedTodos.push(completedTodo);
      
      // Update the subjects and localStorage
      this.todosSubject.next(currentTodos);
      this.completedTodosSubject.next(completedTodos);
      localStorage.setItem('todos', JSON.stringify(currentTodos));
      localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
    }
  }
  removeTodo(id: string, isCompleted: boolean) {
    if (isCompleted) {
      const completedTodos = this.completedTodosSubject.getValue();
      const updatedCompletedTodos = completedTodos.filter(item => item.id !== id);
      this.completedTodosSubject.next(updatedCompletedTodos);
      localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));
    } else {
      const currentTodos = this.todosSubject.getValue();
      const updatedTodos = currentTodos.filter(item => item.id !== id);
      this.todosSubject.next(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  }
}
