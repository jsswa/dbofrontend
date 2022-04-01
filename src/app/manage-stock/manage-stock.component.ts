import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.css']
})
export class ManageStockComponent implements OnInit {
  productsPoisson;
  productsCrustaces;
  productsCoquillages;
  newQuantity;
  newPromotion;
  prixTransaction;
  categories = [
    { id: 1, name: 'poissons', products: null  },
    { id: 2, name: 'crustaces', products: null },
    { id: 3, name: 'coquillages', products: null },
  ];
  poissons:boolean = true;
  crustaces: boolean=true;
  coquillages: boolean=true;
  visibility = [];


  constructor(public productsService: ProductsService) { }

  ngOnInit() {
    this.newQuantity = [];
    this.newPromotion = [];
    this.prixTransaction = [];
    this.getProductsAll();
  }

  getProductsAll() {
    for (let i = 0; i < this.categories.length; i++){
      this.getProductsCategory(this.categories[i].name);
      console.log(this.categories[i].products)
    }
  }

  getProductsCategory(category) {
    this.productsService.getProductCategories(category).subscribe(res => {
      for (let i = 0; i < this.categories.length; i++)
        if (this.categories[i].name == category) {
          this.categories[i].products = res;
        }
    },
      (err) => {
        alert('failed loading json data');
      });
  }

  onModifyPromotion() {
    for (let tig_id = 0; tig_id < this.newPromotion.length; tig_id++) {
      if (this.newPromotion[tig_id]) {
        this.productsService.setPromotion(tig_id, this.newPromotion[tig_id]).subscribe(res => {
          res;
        },
          (err) => {
            alert('failed loading json data');
          });
      }
    }
    console.log(this.newPromotion)
    this.getProductsAll();
  }

  addQuantity() {
    for (let tig_id = 0; tig_id < this.newQuantity.length; tig_id++) {
      if (this.newQuantity[tig_id]) {
        if (this.prixTransaction[tig_id]){
          this.addTransaction(tig_id, "Purchase");
          /*this.productsService.addQuantity(tig_id, this.newQuantity[tig_id]).subscribe(res => {
            res;
          },
            (err) => {
              alert(err + 'failed loading json data');
            });*/
        }
      }
    }
    console.log(this.newQuantity);
    this.getProductsAll();
  }

  removeQuantity() {
    for (let tig_id = 0; tig_id < this.newQuantity.length; tig_id++) {
      if (this.newQuantity[tig_id]) {
        if (this.prixTransaction[tig_id]) {
          if (this.prixTransaction[tig_id] == 0)
            this.addTransaction(tig_id, "Unsold");
          else
            this.addTransaction(tig_id, "Sale")
          /*this.productsService.removeQuantity(tig_id, this.newQuantity[tig_id]).subscribe(res => {
            res;
          },
            (err) => {
              alert(err + 'failed loading json data');
            });*/
        }
      }
    }
    console.log(this.newQuantity);
    this.getProductsAll();
  }

  modifyStock(){
    this.addQuantity();
    this.onModifyPromotion();
    this.getProductsAll();
  }

  addTransaction(tig_id, type){
    if (this.newQuantity[tig_id] && this.prixTransaction[tig_id]) {
      let trans = {
        "price": this.prixTransaction[tig_id],
        "quantity": this.newQuantity[tig_id],
        "tig_id": tig_id,
        "type": type
      }
      this.productsService.postTransaction(trans).subscribe(res => {
        res;
      },
      (err) => {
        alert(err + 'failed loading json data');
      });
    }
  }

  onclick(item){
    if(item == "poissons"){
      //this.poissons = !this.poissons;
      this.visibility["poissons"] = !this.visibility["poissons"];

    }
    if(item == "coquillages"){
      //this.coquillages = !this.coquillages;
      this.visibility["coquillages"] = !this.visibility["coquillages"];

    }
    if(item == "crustaces"){
      //this.crustaces = !this.crustaces;
      this.visibility["crustaces"] = !this.visibility["crustaces"];

    }
  }
}
