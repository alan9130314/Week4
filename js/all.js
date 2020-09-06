new Vue({
    el: '#app',
    data: {
      products: [],
      pagination: {},
      tempProduct: {
        imageUrl: [],
      },
      isNew: false,
      status: {
        fileUploading: false,
      },
      user: {
        token: '',
        uuid: '69d7fd56-1f0f-42c9-b209-51c359d76a0b',
      },
    },
    created() {
      // 取得 token 的 cookies
      // 詳情請見：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
      this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      // 若無法取得 token 則返回 Login 頁面
      if (this.user.token === '') {
        window.location = 'Login.html';
      }
      //created時執行取得產品資料函式
      this.getProducts();
    },
    methods: {
      // 取得產品資料 頁面預設值為1
      getProducts(page = 1) {
        const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
        //預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
  
        axios.get(api).then((response) => {
            //取得產品及分頁資料並存取
          this.products = response.data.data;
          this.pagination = response.data.meta.pagination;
        });
      },
      // 開啟 Modal 視窗 傳入isNew判斷是否為 新增/編輯/刪除 商品  item為傳入的modal中的商品資料
      openModal(isNew, item) {
        switch (isNew) {
          case 'new':
              //為新增時清空productModel中的tempProduct
            this.$refs.productModel.tempProduct = {
              imageUrl: [],
            };
            this.isNew = true;
            //顯示modal
            $('#productModal').modal('show');
            break;
          case 'edit':
            //建立新的物件 使傳入的item被監控
            this.tempProduct = Object.assign({}, item);
            // 使用 refs 觸發子元件方法
            this.$refs.productModel.getProduct(this.tempProduct.id);
            this.isNew = false;
            break;
          case 'delete':
            //建立新的物件 使傳入的item被監控
            this.tempProduct = Object.assign({}, item);
            $('#delProductModal').modal('show');
            break;
          default:
            break;
        }
      },
    },
  })
  