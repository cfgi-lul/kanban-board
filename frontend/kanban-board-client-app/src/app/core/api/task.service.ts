import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Task } from '../models/classes/Task';
import { TaskDTO } from '../models/requestModels/model/models';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http
      .get<TaskDTO[]>(this.baseUrl)
      .pipe(map(e => e.map(el => new Task(el))));
  }

  getTasksByID(id: string | number): Observable<Task> {
    return this.http
      .get<TaskDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(e => new Task(e)));
  }

  createTask(task: Task, boardId: string, columnId: string): Observable<Task> {
    return this.http
      .post<TaskDTO>(this.baseUrl, task, { params: { boardId, columnId } })
      .pipe(map(e => new Task(e)));
  }

  updateTask(updatedTask: Task): Observable<Task> {
    return this.http
      .put<TaskDTO>(`${this.baseUrl}/${updatedTask.id.toString()}`, updatedTask)
      .pipe(map(e => new Task(e)));
  }

  deleteTask(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
