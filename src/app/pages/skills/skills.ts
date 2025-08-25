import { Component, OnInit } from '@angular/core';
import { SkillsData, Formation, Experience } from '../../models/skills.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillsService } from '../../services/skills';

@Component({
  selector: 'app-skills',
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills implements OnInit {
  activeTab: 'formations' | 'experiences' = 'formations';
  data!: SkillsData ;
  filteredItems: (Formation | Experience)[] = [];

  // Listes uniques pour les filtres
  tagsList: string[] = [];
  entreprisesList: string[] = [];
  datesList: string[] = [];

  // Valeurs sélectionnées
  selectedTag: string = '';
  selectedEntreprise: string = '';
  selectedDate: string = '';

  constructor(private skillsService: SkillsService) {}

  ngOnInit() {
    this.skillsService.getSkills().subscribe(res => {
      this.data = res;
      this.generateFilters();
      this.updateFilteredItems();
    });
  }

  setTab(tab: 'formations' | 'experiences') {
    this.activeTab = tab;
    this.resetFilters();
    this.generateFilters();
    this.updateFilteredItems();
  }

  resetFilters() {
    this.selectedTag = '';
    this.selectedEntreprise = '';
    this.selectedDate = '';
  }

  generateFilters() {
    if (!this.data) return;

    const items = this.data[this.activeTab] || [];

    // Tags
    this.tagsList = Array.from(
      new Set(items.flatMap(item => item.tags))
    ).sort() as string[];

    // Entreprises ou centres
    this.entreprisesList = Array.from(
      new Set(items.map(item =>
        this.activeTab === 'formations'
          ? (item as Formation).centre
          : (item as Experience).entreprise
      ))
    ).sort() as string[];

    // Dates
    this.datesList = Array.from(
      new Set(items.map(item => item.date))
    ).sort() as string[];
  }

  updateFilteredItems() {
    let items: (Formation | Experience)[] = this.data[this.activeTab] || [];

    if (this.selectedTag) {
      items = items.filter(item => item.tags.includes(this.selectedTag));
    }

    if (this.selectedEntreprise) {
      items = items.filter(item =>
        this.activeTab === 'formations'
          ? (item as Formation).centre === this.selectedEntreprise
          : (item as Experience).entreprise === this.selectedEntreprise
      );
    }

    if (this.selectedDate) {
      items = items.filter(item => item.date === this.selectedDate);
    }

    this.filteredItems = items;
  }

  getTitre(item: Formation | Experience): string {
    return this.activeTab === 'formations'
      ? (item as Formation).titre
      : (item as Experience).poste;
  }

  getOrganisation(item: Formation | Experience): string {
    return this.activeTab === 'formations'
      ? (item as Formation).centre
      : (item as Experience).entreprise;
  }

}
