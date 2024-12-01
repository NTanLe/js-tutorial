class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }
}
export let products = [];
export function loadProducts(fun) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      return new Product(productDetails)
    })
    console.log(products);
    fun()
  });
  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();

}

