import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, NgStyle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio');

  background = 'rgb(15, 23, 42)';
  
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    this.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(29, 78, 2016, 0.15) 0px,
        rgba(255,255,255,0) 500px
      ),
      rgb(15, 23, 42)
    `;
  }
}
