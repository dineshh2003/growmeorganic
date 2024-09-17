export class ProductService {
    static getProductsMini() {
        return fetch('path/to/api')
            .then(res => res.json())
            .then(data => data.products);
    }
}


