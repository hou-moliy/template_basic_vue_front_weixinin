module.exports = {
  env: { // 用来预定义全局环境变量，常用的有browser，es6,node,jest,jquery
    browser: true,
    commonjs: true,
    es2021: true,
  },
  globals: {
    uni: true,
    wx: true,
  },
  extends: [ // 检查包括了那些规范，通过这个节点可以配置使用 内置规范 还是 第三方规范
    "plugin:vue/recommended",
    "standard",
  ],
  overrides: [
    {
      files: ["src/pages/index.vue", "src/pages/**/index.vue"],
      rules: {
        "vue/multi-word-component-names": 0,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 12, // ECMAScript 版本,最新的
  },
  plugins: [ // eslint支持使用第三方插件，需要npm先安装,后使用
    "vue", // 可以用package的名称,eslint-plugin-vue，也可以省略eslint-plugin-,直接填写vue
  ],
  rules: { // 自定义检查规范
    // 规则说明：
    // 第一个参数：
    // "off"或0 - 关闭规则
    // "warn"或1 - 将该规则作为警告打开（不影响退出代码）
    // "error"或2 - 将规则作为错误打开（退出代码将为1）
    // 第二个参数
    // always（默认）：举例在语句末尾需要分号
    // never：举例不允许加分号
    // 举例=>  "semi":[2,'never'] 表示不允许有分号，有分号就会报错
    indent: ["error", 2, { SwitchCase: 1 }], // 2个空格缩进
    quotes: [1, "double"], // 建议使用双引号
    semi: [1, "always"], // 建议以分号结尾
    "comma-dangle": ["error", "always-multiline"], // 对象字面量项尾是逗号
    "no-var": "error",
    "no-nested-ternary": "error", // 禁止使用嵌套的三元表达式
    "space-before-function-paren": [2, "always"], // 函数定义时括号前面必须有空格
    eqeqeq: [1, "always"], // 警告，要求使用 === 和 !==,这里似乎和sonar有点差异
    "no-console": "off",
    "no-debugger": "off",
    camelcase: ["error", { properties: "never", ignoreDestructuring: true }], // 使用驼峰命名，不检查属性名称，不检查解构标识符
    "vue/html-indent": ["error", 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: false,
      ignores: ["VAttribute"],
    }],
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": ["error", {
      html: {
        void: "always",
        normal: "always",
        component: "always",
      },
      svg: "always",
      math: "always",
    }],
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
  },
};
