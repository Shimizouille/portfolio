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

  getColorForTag(tag: string): string {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash en code couleur hex
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;

    // Hue = entre 0 et 360
    // const hue = Math.abs(hash) % 360;
    // const saturation = 50; // % (plus bas = plus gris, plus haut = plus vif)
    // const lightness = 75;  // % (plus haut = plus clair/pastel)

    // return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getTextColor(bgColor: string): string {
    // extrait R,G,B de "#RRGGBB"
    const r = parseInt(bgColor.substring(1, 3), 16);
    const g = parseInt(bgColor.substring(3, 5), 16);
    const b = parseInt(bgColor.substring(5, 7), 16);

    // calcul de la luminosité (selon ITU-R BT.709)
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // seuil classique ≈ 128 (milieu de 0–255)
    return luminance > 150 ? 'black' : 'white';

    // // extraire les valeurs h, s, l depuis hsl(h, s%, l%)
    // const result = /hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/.exec(bgColor);
    // if (!result) return "black"; // fallback

    // const l = parseInt(result[3], 10);

    // // si la luminosité est trop haute → texte noir, sinon blanc
    // return l > 60 ? "black" : "white";
  }

}
