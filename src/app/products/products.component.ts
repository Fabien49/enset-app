import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Observable} from "rxjs";
import {Product} from "../model/product.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  public products : Array<Product>=[];
  public keyword : string="";
  totalPages : number=0;
  pageSize : number=3;
  currentPage : number=1;
  constructor(private productService : ProductService, private router : Router) {
  }

  ngOnInit() {
    this.searchProducts()
  }

  searchProducts(){
    this.productService.searchProducts(this.keyword, this.currentPage, this.pageSize)
      .subscribe({
        next : (resp) => {
          this.products = resp.body as Product[];
          let totalProducts:number=parseInt(resp.headers.get('x-total-count')!);
          this.totalPages = Math.floor(totalProducts / this.pageSize);
          if(totalProducts % this.pageSize !=0){
            this.totalPages = this.totalPages+1;
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
        this.products=this.products.filter(p=>p.id!=product.id);
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
    this.currentPage=page;
    this.searchProducts()
  }

  handleEditProduct(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)

  }
}

