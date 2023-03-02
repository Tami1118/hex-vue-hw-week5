const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'ziyi';


// 客戶購物 - 產品(Products)
export const getAllProducts = `${apiUrl}/api/${apiPath}/products/all`; // get 無分頁
export const getProducts = `${apiUrl}/api/${apiPath}/products`;        // get 有分頁
export const getProduct = `${apiUrl}/api/${apiPath}/product`;          // get 單一產品加上 /${id}


// 客戶購物 - 購物車(Cart)
export const cartUrl = `${apiUrl}/api/${apiPath}/cart`;   // post, get, put(單一，加${id}), delete(單一，加${id})
export const cartsUrl = `${apiUrl}/api/${apiPath}/carts`; // delete



// 客戶訂單
export const orderUrl = `${apiUrl}/api/${apiPath}/order`;