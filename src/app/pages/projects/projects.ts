import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {

  getColorForTag(tag: string): string {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Hue = entre 0 et 360
    const hue = Math.abs(hash) % 360;
    const saturation = 50; // % (plus bas = plus gris, plus haut = plus vif)
    const lightness = 75;  // % (plus haut = plus clair/pastel)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getTextColor(bgColor: string): string {
    // extraire les valeurs h, s, l depuis hsl(h, s%, l%)
    const result = /hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/.exec(bgColor);
    if (!result) return "black"; // fallback

    const l = parseInt(result[3], 10);

    // si la luminosité est trop haute → texte noir, sinon blanc
    return l > 60 ? "black" : "white";
  }

}
