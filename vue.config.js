// 读取 manifest.json ，修改后重新写入
const fs = require("fs");
const path = require("path");
// 不要修改本段内容！！！
const manifestPath = "./src/manifest.json";
let Manifest = fs.readFileSync(manifestPath, { encoding: "utf-8" });
function replaceManifest (path, value) {
  const arr = path.split(".");
  const len = arr.length;
  const lastItem = arr[len - 1];
  let i = 0;
  const ManifestArr = Manifest.split(/\n/);
  for (const item of ManifestArr) {
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
    if (i === len) {
      const hasComma = /,/.test(item);
      item.replace(new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`), `"${lastItem}": ${value}${hasComma ? "," : ""}`);
      break;
    }
  }
  Manifest = ManifestArr.join("\n");
}

function resolve (dir) {
  return path.join(__dirname, dir);
}

// 修改需要替换manifest.json文件中的内容
replaceManifest("mp-weixin.appid", `"${process.env.VUE_APP_ID}"`);

fs.writeFileSync(manifestPath, Manifest, {
  flag: "w",
});
// 代码压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"), // This line must in sass option
      },
    },
  },
  devServer: {
    https: false,
    port: 8102,
    disableHostCheck: true,
    proxy: {
    },
    allowedHosts: [
      "galileo.natapp4.cc",
      "t75.ebupt.com.cn",
      "t133.ebupt.com.cn:8050",
      "hdhtest.nat300.top",
    ],
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"));
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader").loader("worker-loader")
      .options({
        inline: true,
        fallback: false,
      }).end();
  },
  configureWebpack: config => {
    // 可以省略后缀
    config.resolve.extensions = [".js", ".vue", ".json"];
    config.plugins.push(
      new UglifyJsPlugin({
        sourceMap: true, // 关掉sourcemap 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
        parallel: true, // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
      }),
    );
    config.plugins = [...config.plugins];
  },
};
