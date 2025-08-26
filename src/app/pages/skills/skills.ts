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
  yearsList: string[] = [];

  // Valeurs sélectionnées
  selectedTagsMap: { [key: string]: boolean } = {};
  selectedEntreprise: string = '';
  selectedYear: string = '';
  selectedDateOrder: '' | 'asc' | 'desc' = '';

  // Modal tags
  showTagsModal = false;
  tagSearch = '';

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
    this.selectedEntreprise = '';
    this.selectedYear = '';
    this.selectedDateOrder = '';
    Object.keys(this.selectedTagsMap).forEach(tag => this.selectedTagsMap[tag] = false);
    this.updateFilteredItems();
  }

  generateFilters() {
    if (!this.data) return;

    const items = this.data[this.activeTab] || [];

    // Tags
    this.tagsList = Array.from(
      new Set(items.flatMap(item => item.tags))
    ).sort() as string[];
    this.tagsList.forEach(tag => {
      if (!(tag in this.selectedTagsMap)) {
        this.selectedTagsMap[tag] = false;
      }
    });

    // Entreprises ou centres
    this.entreprisesList = Array.from(
      new Set(items.map(item =>
        this.activeTab === 'formations'
          ? (item as Formation).centre
          : (item as Experience).entreprise
      ))
    ).sort() as string[];

    // Années
    this.yearsList = Array.from(
      new Set(items.map(item => new Date(item.date).getFullYear().toString()))
    ).sort((a, b) => parseInt(b) - parseInt(a));
  }

  updateFilteredItems() {
    let items: (Formation | Experience)[] = this.data[this.activeTab] || [];

    // Filtre Tags (au moins un tag sélectionné doit correspondre)
    const selectedTags = Object.keys(this.selectedTagsMap).filter(tag => this.selectedTagsMap[tag]);
    if (selectedTags.length > 0) {
      items = items.filter(item =>
        item.tags.some(t => selectedTags.includes(t))
      );
    }

    // Filtre entreprise
    if (this.selectedEntreprise) {
      items = items.filter(item =>
        this.activeTab === 'formations'
          ? (item as Formation).centre === this.selectedEntreprise
          : (item as Experience).entreprise === this.selectedEntreprise
      );
    }

    // Filtre année
    if (this.selectedYear) {
      items = items.filter(item =>
        new Date(item.date).getFullYear().toString() === this.selectedYear
      );
    }

    // Tri date
    if (this.selectedDateOrder === 'desc') {
      items = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (this.selectedDateOrder === 'asc') {
      items = items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    this.filteredItems = items;
  }

  toggleAllTags(value: boolean) {
    Object.keys(this.selectedTagsMap).forEach(tag => this.selectedTagsMap[tag] = value);
    this.updateFilteredItems();
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

  // Ouvrir/fermer modal
  openTagsModal() {
    this.showTagsModal = true;
  }

  closeTagsModal() {
    this.showTagsModal = false;
    this.tagSearch = '';
  }

  // Compteur tags sélectionnés
  getSelectedTagsCount(): number {
    return Object.values(this.selectedTagsMap).filter(v => v).length;
  }

  // Filtrer tags dans modal
  filteredTags(): string[] {
    return this.tagsList.filter(tag =>
      tag.toLowerCase().includes(this.tagSearch.toLowerCase())
    );
  }

  // Récupérer liste des tags sélectionnés (si besoin pour affichage chips)
  getSelectedTags(): string[] {
    return Object.keys(this.selectedTagsMap).filter(tag => this.selectedTagsMap[tag]);
  }

}
