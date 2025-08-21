import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillsData } from '../models/skills.model';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private dataUrl = 'assets/data/skills.json';

  constructor(private http: HttpClient) {}

  getSkills(): Observable<SkillsData> {
    return this.http.get<SkillsData>(this.dataUrl);
  }
}
