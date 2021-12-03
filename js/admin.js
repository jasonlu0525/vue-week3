import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.22/vue.esm-browser.min.js';

createApp({
    data() {
        return {
            products: [],
            showDetailData: [],
            userRequest: "",
            productUrl: 'https://vue3-course-api.hexschool.io/v2',
            addNewData: {},
            deletdDataID:''
        }
    },
    methods: {
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            axios.post("https://vue3-course-api.hexschool.io/v2/api/user/check").then((res) => {

                    console.log(res)
                    return axios.get("https://vue3-course-api.hexschool.io/v2/api/jason/admin/products"); // Promise 鏈接

                }).catch((err) => {
                    console.dir(err);
                    if (!err.response.data.success) {
                        alert(err.response.data.message);
                        location = "index.html"
                    }

                })
                .then((res) => { // 驗證登入狀態後取得產品資料
                    console.log(res.data.products);
                    this.products = res.data.products

                })
        },
        showDetail(e) {


            this.showDetailData = Object.assign({}, this.products[e.target.dataset.id - 1]) // 淺層拷貝
            console.log(this.showDetailData);

        },
        isActiveChange(e) {
            this.products[e.target.dataset.id - 1].is_enabled = !this.products[e.target.dataset.id - 1].is_enabled;
        },
        showModal(DOM) {
            new bootstrap.Modal(document.querySelector(DOM)).show();
        },
        Axios(method, url, config = "") {
            console.log(url, {
                data: config
            });
            this.userRequest[method](url, config).then((res) => {
                return axios.get("https://vue3-course-api.hexschool.io/v2/api/jason/admin/products"); // Promise 鏈接
            }).catch((err) => {
                console.log(err);
            }).then((res) => { // 驗證登入狀態後取得產品資料
                console.log(res.data.products);
                this.products = res.data.products

            })

        },
        deletdData(){
           this.Axios('delete',`/api/jason/admin/product/${item.id}`)
        },
        addNewDataCanceled(){
            this.addNewData = {}
        }


    },
    computed: {

    },
    created() {
        this.checkLogin();
        this.userRequest = axios.create({
            baseURL: 'https://vue3-course-api.hexschool.io/v2',

        })
    },
    computed: {

    },

}).mount("#app");