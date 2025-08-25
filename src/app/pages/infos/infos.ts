import { Component, OnInit } from '@angular/core';
import { DependenciesService } from '../../services/dependencies';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-infos',
  imports: [FontAwesomeModule],
  templateUrl: './infos.html',
  styleUrl: './infos.css'
})
export class Infos implements OnInit {
  dependencies: { name: string; version: string }[] = [];
  faArrowRight = faArrowRight;

  constructor(private depService: DependenciesService) {}

  ngOnInit() {
    this.depService.getDependencies().subscribe((data) => {
      this.dependencies = Object.entries(data).map(([name, version]) => ({ name, version }));
    });
  }
}
