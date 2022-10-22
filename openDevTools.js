#!/usr/bin/env node
// 此文件用于工程化配置读取和本地运行启动微信开发者工具，一般情况下不要修改！！！
// 先获取微信开发者工具安装路径
const config = require("./openDevTools/config.js");
const WEIXIN_DEVTOOLS_PATH = config.weixin.path;

// 执行vue-cli编译命令
const path = require("path");
const shell = require("shelljs");
const fs = require("fs");
// 运行项目路径读取
const PRESET_PATH = path.resolve(__dirname);
const WEIXIN_PROJECT_PATH = "dist";
// 微信项目源码路径
const WEIXIN_PRESET_PATH = path.resolve(PRESET_PATH, WEIXIN_PROJECT_PATH);
const PROJECT = path.resolve(WEIXIN_PRESET_PATH, "./project.config.json");
const EXEC_CODE = `npx cross-env UNI_PLATFORM=mp-weixin vue-cli-service uni-build --watch  --mode ${process.env.NODE_ENV}`;

shell.cd(PRESET_PATH); // 先进入项目目录
const childProcess = shell.exec(EXEC_CODE, { async: true });

childProcess.stdout.on("data", function (data) {
  if (data.match("Build complete")) {
    console.log("微信小程序编译成功", process.env.APP_Id);
    // 重写project.config.json文件
    const PROJECT_CONFIG = JSON.parse(fs.readFileSync(PROJECT).toString());
    PROJECT_CONFIG.appid = process.env.APP_Id;
    const writeFileStr = JSON.stringify(PROJECT_CONFIG, null, "\t");
    fs.writeFileSync(PROJECT, writeFileStr);
    shell.cd(WEIXIN_DEVTOOLS_PATH);
    // 打开小程序项目
    const openDevToolsShell = `cli open --project ${WEIXIN_PRESET_PATH} --color=always`;
    shell.exec(openDevToolsShell, { async: true });
  }
});

childProcess.stderr.on("data", function (data) {
  // console.log('stderr: ' + data)
});
