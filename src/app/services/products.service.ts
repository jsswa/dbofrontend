import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  urlApi;

  constructor(public http: HttpClient) {
    this.urlApi = 'http://localhost:8000';
  }

  getProducts(){
    return this.http.get(this.urlApi + '/infoproducts/');
  }
  setPromotion(id, discount) {
    return this.http.get(this.urlApi + '/modifyDiscount/' + id + '/' + discount + '/');
  }
  addQuantity(id, quantity){
    return this.http.get(this.urlApi + '/incrementStock/' + id + '/' + quantity + '/');
  }
  removeQuantity(id, quantity) {
    return this.http.get(this.urlApi + '/decrementStock/' + id + '/' + quantity + '/');
  }
  getProductCategories(category){
    return this.http.get(this.urlApi + '/' + category + '/');
  }
  postTransaction(trans) {
    return this.http.post(this.urlApi + '/transactions/', trans);
  }
  getTransaction() {
    return this.http.get(this.urlApi + '/transactions/');
  }
  getTransactionCategory(category) {
    console.log(category)
    return this.http.get(this.urlApi + '/transactions/' + category + '/');
  }
}
