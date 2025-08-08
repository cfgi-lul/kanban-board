import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TaskInstance } from '../models/classes/TaskInstance';
import { TaskDTO } from '../models/requestModels/model/taskDTO';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/tasks';

  getAllTasks(): Observable<TaskInstance[]> {
    return this.http
      .get<TaskDTO[]>(this.baseUrl)
      .pipe(map(e => e.map(el => new TaskInstance(el))));
  }

  getTasksByID(id: string | number): Observable<TaskInstance> {
    return this.http
      .get<TaskDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(e => new TaskInstance(e)));
  }

  createTask(
    task: TaskInstance,
    boardId: string,
    columnId: string
  ): Observable<TaskInstance> {
    return this.http
      .post<TaskDTO>(this.baseUrl, task, { params: { boardId, columnId } })
      .pipe(map(e => new TaskInstance(e)));
  }

  updateTask(updatedTask: TaskInstance): Observable<TaskInstance> {
    return this.http
      .put<TaskDTO>(`${this.baseUrl}/${updatedTask.id.toString()}`, updatedTask)
      .pipe(map(e => new TaskInstance(e)));
  }

  deleteTask(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
