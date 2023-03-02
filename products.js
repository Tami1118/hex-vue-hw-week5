// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { getAllProducts, getProduct, cartUrl, orderUrl } from './config.js';


Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});


const { localize, loadLocaleFromURL } = VeeValidateI18n;
// 讀取外部資源之中文檔
loadLocaleFromURL( 
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
);

// Activate the locale
VeeValidate.configure({
  generateMessage: localize('zh_TW'), // 設定切換中文檔
  validateOnInput: true, // 當輸入文字時，立即進行驗證
});




const productModal = {
  template: '#userProductModal',
  props: ['id', 'sendId', 'addToCart'],
  data() {
    return {
      modal: {}, // 需要一個實體化賦予的結果
      tempProduct: {},
      qty: 1, // 預設值
    }
  },
  methods: {
    hide() { // 元件方法
      this.modal.hide();
    },
  },
  watch: {
    id() { // 當id'變動'時，取得遠端資料並呈現modal
      // console.log('傳入的productId:', this.id); // 外層props傳入的id
      
      if (this.id) { // 當id為true時
        axios.get(`${getProduct}/${this.id}`)
          .then(res => {
            // console.log('單一產品:', res);
            this.tempProduct = res.data.product;
            this.modal.show();
          });
      }
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal); // 可使用ref或id帶入

    // 當modal關閉可做其他事情
    this.$refs.modal.addEventListener('hidden.bs.modal', (even) => {
      // console.log('Modal被關閉了');
      this.sendId(''); // 清空sendId的id
    })
  }
};



const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: '',
      cart: [],
      loadingItem: '', // 存取id, 判斷 disabled **
      form: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  methods: {
    getProducts() {
      axios.get(getAllProducts)
        .then(res => {
          // console.log('產品資料:',res.data.products);
          this.products = res.data.products;
        })
        .catch(err => {
          alert(err.data.message);
        })
    },


    sendId(id) { // 目的:把id傳進去
      this.productId = id; // 提取productId
      // console.log('傳出的productId:', this.productId);
    },


    addToCart(product_id, qty = 1) { // qty=1 預設值
      // console.log('addToCart');
      // 確認加入購物車 post格式
      const data = {
        product_id,
        qty,
      }
      axios.post(cartUrl, { data })
        .then(res => {
          alert(res.data.message);
          this.getCart();
          this.$refs.productModal.hide(); // 加入購物車後關閉(hide為元件方法)
        })
    },


    getCart() {
      // console.log('getCart');
      axios.get(cartUrl)
        .then(res => {
          // console.log('購物車資料:', res.data.data);
          this.cart = res.data.data;
        })
    },

    updateCartItem(item) { // 產品id 與 購物車id
      const data = {
        product_id: item.product.id,  // 產品id
        qty: item.qty,
      }
      // console.log(data, item); // 確認格式 第一層id為購物車id, 第二層id為產品id
      this.loadingItem = item.id;
      axios.put(`${cartUrl}/${item.id}`, { data }) // 購物車id
        .then(res => {
          // console.log('更新購物車:',res);
          this.getCart();
          this.loadingItem = '';
        })
    },

    deleteCartItem(item) {
      this.loadingItem = item.id;
      axios.delete(`${cartUrl}/${item.id}`)
        .then(res => {
          // console.log('刪除購物車:',res);
          this.getCart();
          this.loadingItem = '';
        })
    },


    createOrder(){
      const data = this.form;
      axios.post(orderUrl, {data})
        .then(res => {
          // console.log('新增訂單:',res);
          this.getCart();
        })
    }

  },
  components: {
    productModal,
  },
  mounted() {
    // console.log('mounted');
    this.getProducts();
    this.getCart();
  }
})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');