export interface Formation {
  date: string;
  centre: string;
  titre: string;
  description: string;
  tags: string[];
}

export interface Experience {
  date: string;
  entreprise: string;
  client: string;
  poste: string;
  description: string;
  tags: string[];
}

export interface SkillsData {
  formations: Formation[];
  experiences: Experience[];
}
