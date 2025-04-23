import { Routes } from '@angular/router';
import {HomeComponent} from '../components/home/home.component';
import {AboutComponent} from '../pages/about/about.component';
import {ProductsComponent} from '../pages/products/products.component';
import {ServicesComponent} from '../pages/services/services.component';
import {MontageComponent} from '../pages/montage/montage.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'montage', component: MontageComponent },
  { path: 'services', component: ServicesComponent },
];
