const globalData = {
  appId: process.env.VUE_APP_ID,
  staticImgs: process.env.VUE_APP_STATIC_IMGS,
};
console.log('当前环境：globalData', process.env)
export default globalData
