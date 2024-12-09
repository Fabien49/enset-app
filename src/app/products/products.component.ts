import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Observable} from "rxjs";
import {Product} from "../model/product.model";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{


  constructor(private productService : ProductService, private router : Router, public appState : AppStateService) {
  }

  ngOnInit() {
    this.searchProducts()
  }

  searchProducts(){
    this.productService.searchProducts(this.appState.productState.keyword, this.appState.productState.currentPage, this.appState.productState.pageSize)
      .subscribe({
        next : (resp) => {
          this.appState.productState.products = resp.body as Product[];
          let totalProducts:number=parseInt(resp.headers.get('x-total-count')!);
          this.appState.productState.totalProducts=totalProducts;
          this.appState.productState.totalPages = Math.floor(totalProducts / this.appState.productState.pageSize);
          if(totalProducts % this.appState.productState.pageSize !=0){
            ++this.appState.productState.totalPages;
          }
        },
        error : err => {
          console.log(err)
        }
      })
    //this.products=this.productService.getProduct();
  }


  handleCheckProduct(product: any) {
    this.productService.checkProduct(product).subscribe({
      next :updatedProduct => {
          product.checked=!product.checked;
      }
    })
  }

  handleDeleteProduct(product: Product) {
    if(confirm("Etes vous sur de vouloir supprimer?"))
    this.productService.deleteProduct(product).subscribe({
      next:value => {
        //this.getProducts();
        //this.appState.productState.products=this.appState.productState.productsfilter((p:any)=>p.id!=product.id);
        this.searchProducts();
      }
    })

  }

/*  searchProduct() {
    this.currentPage=1;
    this.totalPages=0;
    this.productService.searchProduct(this.keyword, this.currentPage ,this.pageSize).subscribe({
      next : value => {
        console.log("Results received:", value);
        this.products=value;
      }
    })
  }*/

  handleGoToPage(page: number) {
    this.appState.productState.currentPage=page;
    this.searchProducts()
  }

  handleEditProduct(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)

  }
}

