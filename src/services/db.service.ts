import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private apiURL = 'http://localhost:42069';
  constructor(
    private httpC: HttpClient,
  ) { }

  getProductByID(id: number) {
    return this.httpC.get(`${this.apiURL}/product=${id}`);
  }

  getAllProducts() {
    return this.httpC.get(`${this.apiURL}/productsAll`);
  }
}
