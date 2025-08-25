import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DependenciesService {
  constructor(private http: HttpClient) {}

  getDependencies(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>('assets/public-dependencies.json');
  }
}
