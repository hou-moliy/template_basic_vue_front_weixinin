import axios from "axios";
import qs from "qs";
import SsoService from "@/api/sso/index.js";
axios.defaults.baseURL = "";
axios.create().defaults.timeout = 5000; // 请求超时
let loading;
let isloading = false;

// http request 拦截器
axios.interceptors.request.use(config => {
  if (isloading) {
    uni.showLoading({
      mask: true,
    });
    loading = true;
  }
  config.headers["x-requested-width"] = "XMLHttpRequest";
  config.headers.Authorization = uni.getStorageSync("Authorization");
  config.headers["Content-Type"] = "application/json; charset=utf-8";
  if (!config.data) return config;
  if (config.data.isUpload) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else if (config.method === "get") {
    config.data = qs.stringify(config.data, {
      indices: false,
    }); // 如果是非上传类型 则 将数据重新组装
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// http response 拦截器
axios.interceptors.response.use(response => {
  if (loading) {
    uni.hideLoading();
    loading = false;
  }
  const data = response.data;
  if (data.code === 401) {
    if (loading) {
      loading = false;
    }
    console.log("#####拦截器###有401页面##########");
    console.log(response);
    console.log("####拦截器####有401页面##########");
    SsoService.refreshToken().then((resp) => {
      if (resp.data.code === 200) {
        uni.setStorageSync("Authorization", `${resp.data.data.tokenHead} ${resp.data.data.token}`);
      } else {
        uni.removeStorageSync("Authorization");
        uni.removeStorageSync("userInfo");
        uni.removeStorageSync("phone");
        uni.removeStorageSync("userSpclData");
        uni.removeStorageSync("isAuth");
        uni.removeStorageSync("aiStatus");
        uni.removeStorageSync("spclStatus");
        uni.removeStorageSync("myLikeIds");
      }
    });
  }
  return response;
}, error => {
  console.log("error", error.response);
  if (error.response.status === 504 || error.response.status === 503 || error.response.status === 404 || !error.response) {
    uni.$emit("timeOut", true);
  }
  uni.hideLoading();
  return Promise.reject(error);
});

// 真机获取
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    const settle = require("axios/lib/core/settle");
    const buildURL = require("axios/lib/helpers/buildURL");
    uni.request({
      method: config.method.toUpperCase(),
      url: (config.url.includes("http://") || config.url.includes("https://"))
        ? buildURL(
          config.url, config.params,
          config.paramsSerializer)
        : config.baseURL + buildURL(config.url, config.params,
          config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete (response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config,
        };

        settle(resolve, reject, response);
      },
    });
  });
};

/**
 * 封装get方法
 * @param url
 * @param data
 * @param loading 是否有加载效果
 * @param headers 头部信息
 * @returns {Promise}
 */
export function get (url, data, loading, config) {
  isloading = loading;
  url = `${url}?${qs.stringify(data, { indices: false })}`;
  return new Promise((resolve, reject) => {
    axios.get(url, config)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        if (!err.response || err.response.status === 504 || err.response.status === 503 || err.response.status === 404 || !err) {
          uni.$emit("timeOut", true);
        }
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @param loading 是否有加载效果
 * @param config config信息
 * @returns {Promise}
 */
export function post (url, data, loading, config = {}) {
  isloading = loading;
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        if (response !== undefined) {
          resolve(response);
        }
      }, err => {
        if (!err.response || err.response.status === 504 || err.response.status === 503 || err.response.status === 404 || !err) {
          uni.$emit("timeOut", true);
        }
        reject(err);
      });
  });
}

/**
 * 封装delete请求
 * @param url
 * @param loading 是否有加载效果
 * @param config config信息
 * @returns {Promise}
 */
export function del (url, config, loading) {
  isloading = loading;
  return new Promise((resolve, reject) => {
    axios.delete(url, config)
      .then(response => {
        if (response !== undefined) {
          resolve(response);
        }
      }, err => {
        reject(err);
      });
  });
}

/**
 * 封装 post 请求 用于上传文件
 * @param url
 * @param data
 * @param loading 是否有加载效果
 * @param config config信息
 * @returns {Promise}
 */
export function upload (url, data, loading, config = {}) {
  isloading = loading;
  if (!data) data = {};
  data.isUpload = true;
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        if (response !== undefined) {
          resolve(response);
        }
      }, err => {
        reject(err);
      });
  });
}

/**
 * 封装 get请求 用于下载文件
 * @param url
 * @param data
 * @param loading 是否有加载效果
 * @returns {Promise}
 */
export function download (url, data, loading) {
  this.get(url, data, loading, {
    responseType: "blob",
  }).then(res => {
    const data = res.data;
    const headers = res.headers;
    const contentDisposition = headers["content-disposition"];
    const contentType = headers["content-type"];
    const attachmentInfoArrary = contentDisposition.split(";");
    let fileName = "";
    if (attachmentInfoArrary.length > 1) {
      fileName = attachmentInfoArrary[1].split("=")[1];
    }
    const blob = new Blob([data], {
      type: contentType,
    });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // 下载完成移除元素
      window.URL.revokeObjectURL(url); // 只要映射存在，Blob就不能进行垃圾回收，因此一旦不再需要引用，就必须小心撤销URL，释放掉blob对象。
    }
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @param loading 是否有加载效果
 * @param config config信息
 * @returns {Promise}
 */
export function patch (url, data, loading, config = {}) {
  isloading = loading;
  return new Promise((resolve, reject) => {
    axios.patch(url, data, config)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      });
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @param loading 是否有加载效果
 * @param config config信息
 * @returns {Promise}
 */
export function put (url, data, loading, config = {}) {
  isloading = loading;
  return new Promise((resolve, reject) => {
    axios.put(url, data, config)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      });
  });
}
