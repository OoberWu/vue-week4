import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

import  pagination  from './pagination.js'

let productModal = null;
let delProductModal = null;
const app = createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: 'oober',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pagination:{}
    };
  },
  components:{
    pagination
  },
  methods: {
    // 新增或編輯產品
    updateProduct(tempProduct) {
      // 預設是新增 api,方法為 post
      let api = `${this.url}/api/${this.path}/admin/product`;
      let httpMethod = 'post';
      // 如果不是新增
      if (!this.isNew) {
        // 修改 api 與方法為 put
        api = `${this.url}/api/${this.path}/admin/product/${tempProduct.id}`;
        httpMethod = 'put';
      }
      // api 行為
      // eslint-disable-next-line no-undef
      axios[httpMethod](api, { data: tempProduct })
        .then((res) => {
          if (res.data.success) {
            productModal.hide();
            this.getProducts();
            alert(res.data.message);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刪除產品
    delProduct(tempProduct) {
      const api = `${this.url}/api/${this.path}/admin/product/${tempProduct.id}`;
      // eslint-disable-next-line no-undef
      axios
        .delete(api)
        .then((res) => {
          if (res.data.success) {
            delProductModal.hide();
            this.getProducts();
            alert(res.data.message);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 打開 Modal
    openModal(isNew, item) {
      // 判斷是新增
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        // 將 isNew 改為 true
        this.isNew = true;
        // 打開產品 Modal
        productModal.show();
        // 判斷是編輯
      } else if (isNew === 'edit') {
        // 將產品拷貝至 tempProduct
        this.tempProduct = { ...item };
        // isNew 改為 false
        this.isNew = false;
        productModal.show();
        // 判斷是刪除
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        // 打開刪除 Modal
        delProductModal.show();
      }
    },
    // 取得產品
    getProducts(page = 1) {
      // eslint-disable-next-line no-undef
      axios
        .get(`${this.url}/api/${this.path}/admin/products?page=${page}`)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // 實體化 modal
    // eslint-disable-next-line no-undef
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    // eslint-disable-next-line no-undef
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal')
    );
    // 取 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      alert('驗證錯誤，請登入');
      // 假如沒有取得 token,網頁導回登入頁
      window.location = 'login.html';
    }
    // axios 設定預設 token
    // eslint-disable-next-line no-undef
    axios.defaults.headers.common['Authorization'] = token;
    // 執行取得產品
    this.getProducts();
  },
});

app.component('productModal', {
  template: `        <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
              <h5 id="productModalLabel" class="modal-title">
                  <span v-if="isNew">新增產品</span>
                  <span v-else>編輯產品</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <div class="row">
                  <div class="col-sm-4">
                      <div class="form-group">
                          <label for="imageUrl">主要圖片</label>
                          <input type="text" class="form-control" placeholder="請輸入圖片連結"
                              v-model="tempProduct.imageUrl" />
                          <img class="img-fluid" :src="tempProduct.imageUrl" />
                      </div>
                      <div class="mb-1">多圖新增</div>
                      <div>
                          <div class="mb-1">
                              <div class="form-group">
                                  <label for="imageUrl">圖片網址</label>
                                  <input type="text" class="form-control" placeholder="請輸入圖片連結" />
                              </div>
                              <img class="img-fluid" />
                          </div>
                          <div>
                              <button class="btn btn-outline-primary btn-sm d-block w-100">
                                  新增圖片
                              </button>
                          </div>
                          <div>
                              <button class="btn btn-outline-danger btn-sm d-block w-100">
                                  刪除圖片
                              </button>
                          </div>
                      </div>
                      <div>
                          <button class="btn btn-outline-primary btn-sm d-block w-100">
                              新增圖片
                          </button>
                      </div>
                  </div>
                  <div class="col-sm-8">
                      <div class="form-group">
                          <label for="title">標題</label>
                          <input id="title" type="text" class="form-control" placeholder="請輸入標題"
                              v-model="tempProduct.title" />
                      </div>
  
                      <div class="row">
                          <div class="form-group col-md-6">
                              <label for="category">分類</label>
                              <input id="category" type="text" class="form-control" placeholder="請輸入分類"
                                  v-model="tempProduct.category" />
                          </div>
                          <div class="form-group col-md-6">
                              <label for="price">單位</label>
                              <input id="unit" type="text" class="form-control" placeholder="請輸入單位"
                                  v-model="tempProduct.unit" />
                          </div>
                      </div>
  
                      <div class="row">
                          <div class="form-group col-md-6">
                              <label for="origin_price">原價</label>
                              <input id="origin_price" type="number" min="0" class="form-control"
                                  placeholder="請輸入原價" v-model.number="tempProduct.origin_price" />
                          </div>
                          <div class="form-group col-md-6">
                              <label for="price">售價</label>
                              <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
                                  v-model.number="tempProduct.price" />
                          </div>
                      </div>
                      <hr />
  
                      <div class="form-group">
                          <label for="description">產品描述</label>
                          <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
                              v-model="tempProduct.description">
          </textarea>
                      </div>
                      <div class="form-group">
                          <label for="content">說明內容</label>
                          <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
                              v-model="tempProduct.content">
          </textarea>
                      </div>
                      <div class="form-group">
                          <div class="form-check">
                              <input id="is_enabled" class="form-check-input" type="checkbox"
                                  v-model="tempProduct.is_enabled" :true-value="1" :false-value="0" />
                              <label class="form-check-label" for="is_enabled">是否啟用</label>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  取消
              </button>
              <button type="button" class="btn btn-primary" @click="$emit('update-product',tempProduct)">
                確認
            </button>
          </div>
      </div>
  </div>
  </div>`,
  props:['isNew','tempProduct'],
  methods: {
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
}),

app.component('delModal', {
  template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
  aria-labelledby="delProductModalLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
              <h5 id="delProductModalLabel" class="modal-title">
                  <span>刪除產品</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              是否刪除
              <strong class="text-danger"></strong>
              商品 {{tempProduct.title}} (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  取消
              </button>
              <button type="button" class="btn btn-danger" @click="$emit('del-product', tempProduct)">
                  確認刪除
              </button>
          </div>
      </div>
  </div>
</div>`,
props:['tempProduct'],
})


app.mount('#app');


