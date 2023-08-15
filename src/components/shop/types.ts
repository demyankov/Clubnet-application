export interface IAddProductForm {
  name: string;
  quantity: string;
  price: string;
  image: Nullable<File>;
}

export interface IAddCategory {
  name: string;
}

export interface IProductItemForm {
  countProduct: number;
}
