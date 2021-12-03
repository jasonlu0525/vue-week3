import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.22/vue.esm-browser.min.js';

createApp({
    data() {
        return {
            products: [],
            userRequest: "",
            mainProductUrl: '',
            subProductUrl: '',
            addNewData: {},
            deletdDataID: '',
            sysTemLoader: {
                title: "",
                message: ""
            }
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

        showModal(DOM, action = '') {
            new bootstrap.Modal(document.querySelector(DOM)).show();
            action ? this.deletdDataID = action : null
        },
        closeModal(DOM) {
            new bootstrap.Modal(document.querySelector(DOM)).hide();
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
        deletdData() {
            this.showModal("#loading");

            this.sysTemLoader = {
                title: "刪除結果",
                message: "成功 !!"

            }


            this.Axios('delete', `/api/jason/admin/product/${ this.deletdDataID}`)

        },
        addNewDataCanceled() {
            this.addNewData = {}
        },
        addMainImg() {
            this.addNewData.imageUrl = this.mainProductUrl;
        },
        removeMainImg() {
            this.addNewData.imageUrl = '';
            this.mainProductUrl = '';
        },

    },
   
    created() {
        this.checkLogin();
        this.userRequest = axios.create({
            baseURL: 'https://vue3-course-api.hexschool.io/v2',

        })
    },


}).mount("#app");