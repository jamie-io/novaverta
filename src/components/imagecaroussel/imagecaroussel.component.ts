import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imagecaroussel',
  imports: [
    CommonModule,  // Add this instead of separate NgFor, NgClass, NgForOf
  ],
  templateUrl: './imagecaroussel.component.html',
  standalone: true,
  styleUrl: './imagecaroussel.component.css'
})
export class ImagecarousselComponent {
  slides = [
    { image: 'assets/static/06.jpg', title: 'Produkt 1', description: 'Beschreibung für Produkt 1' },
    { image: 'assets/static/03.jpg', title: 'Produkt 2', description: 'Beschreibung für Produkt 2' },
    { image: 'assets/static/01.jpg', title: 'Produkt 3', description: 'Beschreibung für Produkt 3' }
  ];
  currentSlide = 0;

  prevSlide() {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slides.length - 1;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide < this.slides.length - 1) ? this.currentSlide + 1 : 0;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
