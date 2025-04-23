import { Component, OnInit } from '@angular/core';
import { IProduct} from '../../interfaces/iproduct';
import {NgForOf, NgIf} from '@angular/common';
import {DbService} from '../../services/db.service';

@Component({
  selector: 'app-products',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './products.component.html',
  standalone: true,
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: ({
    image: string;
    price: null;
    name: string;
    description: string;
    currency: string;
    id: number;
    category: string;
    stock: number;
    isBestseller?: boolean;
    dimensions?: string;
  })[] = [];

  filteredProducts: any[] = [];
  bestsellers: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  constructor(
    private dbService: DbService,
  ) {}

  ngOnInit() {
    this.dbService.getAllProducts().subscribe(p => {
      console.log(p);
      //this.products.push(p)
    })

    this.loadProducts();
    this.extractCategories();
    this.setBestsellers();
    this.filteredProducts = this.products;
  }

  loadProducts() {

    // Add dimensions information formatted as Width x Length
    this.products.forEach(product => {
      // Sample dimension formatting - in a real app, you would have actual dimension data
      const width = Math.floor(Math.random() * 500) + 300;
      const length = Math.floor(Math.random() * 700) + 300;
      product.dimensions = `${width}×${length} mm`;

      // Mark approximately 30% of products as bestsellers
      product.isBestseller = Math.random() > 0.7;
    });
  }

  extractCategories() {
    // Get unique categories
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      categorySet.add(product.category);
    });
    this.categories = Array.from(categorySet);
  }

  setBestsellers() {
    // Get products marked as bestsellers or products with highest stock as default
    this.bestsellers = this.products
      .filter(product => product.isBestseller)
      .slice(0, 6); // Show top 6 bestsellers

    // If no bestsellers marked, use high stock products as bestsellers
    if (this.bestsellers.length === 0) {
      this.bestsellers = [...this.products]
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 6);
    }
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;

    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        product => product.category === category
      );
    }
  }



/*
  productsList = {
    "products": [
      {
        "id": 1,
        "name": "Acrylic Paint Set - 24 Colors",
        "category": "Paints",
        "price": null,
        "currency": "USD",
        "stock": 120,
        "description": "10x10cm",
        "image": "../assets/products/pic1.avif",
      },
      {
        "id": 2,
        "name": "Oil Paint Set - 12 Tubes",
        "category": "Paints",
        "price": null,
        "currency": "USD",
        "stock": 80,
        "description": "10x10cm",
        "image": "../assets/products/pic1.avif",
        "dimensions": "10x10"
      },
      {
        "id": 3,
        "name": "Watercolor Paint Set - 36 Colors",
        "category": "Paints",
        "price": null,
        "currency": "USD",
        "stock": 100,
        "description": "10x10cm",
        "image": "../assets/products/pic1.avif",
        "dimensions": "ALALALLALAALLA",
      },
      {
        "id": 4,
        "name": "Round Paint Brushes - Set of 10",
        "category": "Brushes",
        "price": null,
        "currency": "USD",
        "stock": 200,
        "description": "10x10cm",
        "image": "../assets/products/pic1.avif"
      },
      {
        "id": 5,
        "name": "Flat Paint Brushes - Set of 6",
        "category": "Brushes",
        "price": null,
        "currency": "USD",
        "stock": 180,
        "description": "10x10cm",
        "image": "../assets/products/pic1.avif"
      },
      {
        "id": 6,
        "name": "Premium Stretched Canvas - 16x20 inches",
        "category": "Canvases",
        "price": null,
        "currency": "USD",
        "stock": 150,
        "description": "10x10cm",
        "image": "../assets/products/kanister.avif"
      },
      {
        "id": 7,
        "name": "Canvas Pad - 9x12 inches, 10 Sheets",
        "category": "Canvases",
        "price": null,
        "currency": "USD",
        "stock": 100,
        "description": "10x10cm",
        "image": "../assets/products/reiniger.png"
      },
      {
        "id": 8,
        "name": "Wooden Tabletop Easel",
        "category": "Easels",
        "price": null,
        "currency": "USD",
        "stock": 50,
        "description": "10x10cm",
        "image": "../assets/products/staender.jpg"
      },
      {
        "id": 9,
        "name": "Studio Floor Easel",
        "category": "Easels",
        "price": null,
        "currency": "USD",
        "stock": 30,
        "description": "Sturdy and adjustable floor easel, perfect for large canvases.",
        "image": "../assets/products/reiniger.png"      },
      {
        "id": 10,
        "name": "Palette Knives - Set of 5",
        "category": "Accessories",
        "price": null,
        "currency": "USD",
        "stock": 120,
        "description": "Stainless steel palette knives for mixing and applying paint with texture.",
        "image": "../assets/products/reiniger.png"      },
      {
        "id": 11,
        "name": "Artist Paint Palette",
        "category": "Accessories",
        "price": null,
        "currency": "USD",
        "stock": 150,
        "description": "Lightweight plastic palette with multiple wells for mixing colors.",
        "image": "../assets/products/staender.jpg"
      },
      {
        "id": 12,
        "name": "Brush Cleaner - 250ml",
        "category": "Accessories",
        "price": null,
        "currency": "USD",
        "stock": 90,
        "description": "Non-toxic brush cleaner that removes paint without damaging bristles.",
        "image": "../assets/products/pic1.avif"
      },
      {
        "id": 13,
        "name": "Charcoal Sketching Set",
        "category": "Drawing",
        "price": null,
        "currency": "USD",
        "stock": 60,
        "description": "A complete set of charcoal pencils and sticks for detailed sketching.",
        "image": "../assets/products/reiniger.png"      },
      {
        "id": 14,
        "name": "Graphite Pencil Set - 12 Grades",
        "category": "Drawing",
        "price": null,
        "currency": "USD",
        "stock": 110,
        "description": "A variety of graphite pencils for shading and detailed drawings.",
        "image": "../assets/products/pic1.avif"
      },
      {
        "id": 15,
        "name": "Sketchbook - A4, 100 Pages",
        "category": "Paper",
        "price": null,
        "currency": "USD",
        "stock": 200,
        "description": "Acid-free paper, perfect for pencils, charcoal, and ink.",
        "image": "../assets/products/trockner.jpg"
      },
      {
        "id": 16,
        "name": "Ink Pen Calligraphy Set",
        "category": "Calligraphy",
        "price": null,
        "currency": "USD",
        "stock": 75,
        "description": "A set of ink pens for elegant calligraphy writing.",
        "image": "../assets/products/reiniger.png"      },
      {
        "id": 17,
        "name": "Alcohol-Based Markers - Set of 24",
        "category": "Markers",
        "price": null,
        "currency": "USD",
        "stock": 90,
        "description": "Blendable, alcohol-based markers for vibrant illustrations.",
        "image": "../assets/products/what.jpeg"
      },
      {
        "id": 18,
        "name": "Soft Pastels - Set of 48",
        "category": "Pastels",
        "price": null,
        "currency": "USD",
        "stock": 85,
        "description": "High-quality soft pastels for smooth color blending.",
        "image": "../assets/products/spray.jpg"
      },
      {
        "id": 19,
        "name": "Gouache Paint Set - 18 Colors",
        "category": "Paints",
        "price": null,
        "currency": "USD",
        "stock": 95,
        "description": "Opaque and water-soluble gouache paints for bold artwork.",
        "image": "../assets/products/fikter.jpg"
      },
      {
        "id": 20,
        "name": "Artist Tote Bag",
        "category": "Accessories",
        "price": null,
        "currency": "USD",
        "stock": 70,
        "description": "A stylish and spacious bag for carrying art supplies.",
        "image": "../assets/products/kanister.avif"
      }
    ]

  };
 */
}
