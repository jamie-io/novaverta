// components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import {CommonModule, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    CommonModule,  // Add this
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  slideInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.startSlideShow();
  }

  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopSlideShow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  currentSlide = 0;
  // home.component.ts
  slides = [
    { image: './assets/03.jpg', title: 'Industrial Wiring', description: 'High-quality wiring solutions' },
    { image: './assets/04.jpg', title: 'Circuit Boards', description: 'Advanced circuit technology' },
    { image: './assets/06.jpg', title: 'Safety Gear', description: 'Premium protective equipment' }
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
