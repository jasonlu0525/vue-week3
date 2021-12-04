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

            ID: '',


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

        showModal(DOM, id) {
            new bootstrap.Modal(document.querySelector(DOM)).show();
            id ? this.ID = id : null
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
                console.log(element.id === this.ID);
                if (element.id === this.ID) {

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


            this.Axios('delete', `/api/jason/admin/product/${ this.ID}`)

        },
        //建立新的產品 --> 取消
        resetDataAnderrorMessage() {
            this.addNewData = {}
            this.mainProductUrl = '';
            this.errorMessage = {}
            this.subProductUrl = {
                tempName: '',
                collection: []
            }
        },
        renderErrorMessage(errorMsg) {

            console.log("錯誤訊息", errorMsg);

            Object.keys(errorMsg).forEach((items) => {
                this.errorMessage[items] = String(errorMsg[items])

            })

            console.log("處理", this.errorMessage);


        },
        //建立新的產品 --> 確認
        addNewDataConfirm() {

            const error = this.formVadidate();
            console.log(error);

            //error is undefined => {} 
            this.errorMessage = !error ? {} : error;


            if (!error) {
                // 表單驗證沒有錯誤

                this.addNewData.imagesUrl = this.subProductUrl.collection;

                this.products.unshift(this.addNewData)

                console.log(this.addNewData);

                this.Axios('post', `/api/jason/admin/product`, this.addNewData)

                // var myModal = new bootstrap.Modal(document.getElementById('productModal'), {
                //     keyboard: false
                // })
                this.errorMessage = {}
                this.addNewData = {}
                // myModal.hide()
            } else {
                // 表單驗證有錯誤
                this.renderErrorMessage(error);
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
        // 點擊編輯 ==> 帶入一筆 items 資料 以及資料處理
        injectData() {
            console.log('aaa');
            let injectedData = this.products.filter((element) => {

                return element.id === this.ID;

            });

            // 文字的 data
            this.addNewData = injectedData[0];

            //主圖
            this.mainProductUrl = this.addNewData.imageUrl;

            // 副圖
            this.subProductUrl.tempName = [...this.addNewData.imagesUrl[0]];

            this.subProductUrl.collection = [...this.addNewData.imagesUrl];


            console.log(injectedData);

        },

        confirmEditData() {

            const error = this.formVadidate();
            console.log(error);

            //error is undefined => {} 
            this.errorMessage = !error ? {} : error;


            if (!error) {
                // 表單驗證沒有錯誤

                this.addNewData.imagesUrl = this.subProductUrl.collection;

                this.products.forEach((item, index, arr) => {

                    if (item.id === this.ID) {
                        arr.splice(index, this.addNewData)

                    }

                })




                console.log(this.addNewData);

                this.Axios('put', `/api/jason/admin/product/${this.ID}`, this.addNewData)

                // var myModal = new bootstrap.Modal(document.getElementById('productModal'), {
                //     keyboard: false
                // })
                this.errorMessage = {}
                this.addNewData = {}
                // myModal.hide()
            } else {
                // 表單驗證有錯誤
                this.renderErrorMessage(error);
            }


        },
        formVadidate() {
            const constraints = {
                title: {
                    presence: {
                        message: "為必填"
                    },
                    length: {
                        minimum: 4,
                        tooShort: "^ 必須填寫 %{count} 個以上的文字"
                    }
                },
                category: {
                    presence: {
                        message: "為必填",
                    },
                    length: {
                        minimum: 4,
                        tooShort: "^ 必須填寫 %{count} 個以上的文字"
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
                        greaterThanOrEqualTo: 0,
                        message: "^需要填入大於0的數字 "
                    }
                },
                price: {
                    presence: {
                        message: "為必填"
                    },
                    numericality: {
                        greaterThanOrEqualTo: 0,
                        message: "^需要填入大於0的數字 "
                    }
                }
            }

            return validate({
                title: this.addNewData.title,
                category: this.addNewData.category,
                unit: this.addNewData.unit,
                origin_price: this.addNewData.origin_price,
                price: this.addNewData.price,

            }, constraints);
        }

    },
    watch: {
        // 建立新的產品 --> 表單驗證 ---> 更新 this.errorMessage --> 切換確認按鈕 
        addNewData: {
            handler(newValue, oldValue) {

                //  console.log('wateched !!!', newValue, oldValue);
                const error = this.formVadidate() || {};
                console.log(error);

                this.errorMessage = {}


                Object.keys(error).forEach((items) => {
                    console.log(this.addNewData[items]);
                    // 按下確認前，輸入 input 事件的驗證，
                    // this.addNewData[items] !== undefined ==> input 有輸入值
                    // this.addNewData[items] === ''
                    //
                    if (this.addNewData[items] !== undefined || this.addNewData[items] === '') {
                        console.log(this.addNewData[items], 1);
                        this.errorMessage[items] = String(error[items])
                        console.log('  this.errorMessage', this.errorMessage);

                    }


                })
                console.log(Object.entries(error).length === 0);
                if (Object.entries(error).length === 0) {
                    this.errorMessage.pass = true
                }


            },
            deep: true,
            immediate: false

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