import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.22/vue.esm-browser.min.js';

createApp({
    data() {
        return {
            products: [],
            userRequest: "",
            mainProductUrl: '',
            subProductUrl: {
                tempName: '',
                collection: []
            },
            addNewData: {},
            errorMessage: {},
            deletdDataID: '',
            sysTemLoader: {
                title: "",
                message: "",
                isSuccess: false
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
                    if (!err.data.success) {
                        alert(err.data.message);
                        location = "index.html"
                    }

                })
                .then((res) => { // 驗證登入狀態後取得產品資料
                    console.log(res);
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
            this.userRequest[method](url, {
                data: config
            }).then((res) => {
                return axios.get("https://vue3-course-api.hexschool.io/v2/api/jason/admin/products"); // Promise 鏈接
            }).catch((err) => {
                console.log(err);
            }).then((res) => { // 驗證登入狀態後取得產品資料
                console.log(res.data.products);
                this.products = res.data.products

            })

        },

        deletdData() {

            this.products.forEach((element, index) => {
                console.log(element.id === this.deletdDataID);
                if (element.id === this.deletdDataID) {

                    this.products.splice(index, 1)
                }

            });

            this.sysTemLoader.title = "刪除結果";
            this.sysTemLoader.message = "成功 !!";


            this.showModal("#loading");

            setTimeout(() => {
                console.log(this);
                this.closeModal("#loading");
            }, 1000);


            this.Axios('delete', `/api/jason/admin/product/${ this.deletdDataID}`)

        },
        //建立新的產品 --> 取消
        addNewDataCanceled() {
            this.addNewData = {}
            this.errorMessage = {}
        },
        //建立新的產品 --> 確認
        addNewDataConfirm() {

            const error = this.formVadidate();
            console.log(error);
            this.errorMessage = error;

            if (!error) { // 表單驗證沒有錯誤

                this.addNewData.imagesUrl = this.subProductUrl.collection;

                this.products.unshift(this.addNewData)

                console.log(this.addNewData);

                this.Axios('post', `/api/jason/admin/product`, this.addNewData)
                this.errorMessage = undefined;
            }



        },
        // 建立新的產品 -->新增主圖
        addMainImg() {
            this.addNewData.imageUrl = this.mainProductUrl;
        },
        //建立新的產品 --> 移除主圖
        removeMainImg() {
            this.addNewData.imageUrl = '';
            this.mainProductUrl = '';
        },
        // 建立新的產品 -->新增副圖
        addSubImg() {
            if (this.subProductUrl.tempName === "") {
                return
            }

            this.subProductUrl.collection.push(this.subProductUrl.tempName)
            this.subProductUrl.tempName = "";

        },
        //建立新的產品 -->選擇副圖-->  移除副圖
        selectSubImage(SubimgUrl) {
            this.subProductUrl.tempName = SubimgUrl;
        },
        //建立新的產品 -->移除副圖
        removeSubImg() {
            this.subProductUrl.collection.forEach((item, index, arr) => {
                if (this.subProductUrl.tempName === item) {
                    arr.splice(index, 1)
                    this.subProductUrl.tempName = "";

                }
            })

        },
        formVadidate() {
            const constraints = {
                title: {
                    presence: {
                        message: "為必填"
                    },
                    length: {
                        minimum: 4
                    }
                },
                category: {
                    presence: {
                        message: "為必填"
                    },
                    length: {
                        minimum: 4
                    }
                },
                unit: {
                    presence: {
                        message: "為必填"
                    },
                    length: {
                        minimum: 1
                    }
                },
                origin_price: {
                    presence: {
                        message: "為必填"
                    },
                    numericality: {
                        greaterThanOrEqualTo: 0
                    }
                },
                price: {
                    presence: {
                        message: "為必填"
                    },
                    numericality: {
                        greaterThanOrEqualTo: 0
                    }
                }
            }

            return validate({
                title: this.addNewData.title,
                category: this.addNewData.category,
                unit: this.addNewData.unit,
                origin_price: this.addNewData.origin_price,
                price: this.addNewData.origin_price,

            }, constraints);
        }

    },

    created() {
        this.checkLogin();
        this.userRequest = axios.create({
            baseURL: 'https://vue3-course-api.hexschool.io/v2',

        })
        console.log(this.sysTemLoader);

    },


}).mount("#app");