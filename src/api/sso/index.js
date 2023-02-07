// 以sso开头的相关接口放这里
import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
// 统一认证token
const tyrzAuth = params => axios.get(baseUrl + "/threelogin/tyrzauth", params);
const refreshToken = params => axios.get(baseUrl + "/sso/refreshToken", params);
const getLogin = params => axios.post(baseUrl + "/sso/login", params);
// 获取短信验证码
const getAuthCode = params => axios.get(baseUrl + "/sso/getAuthCode", params);

export default {
  tyrzAuth,
  refreshToken,
  getLogin,
  getAuthCode,
};
