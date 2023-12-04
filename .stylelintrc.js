// .stylelintrc.js
module.exports = {
  // Umi 项目
  extends: require.resolve('umi/stylelint'),

  // Umi Max 项目
  // extends: require.resolve('@umijs/max/stylelint'),
  // 添加任何额外的规则或覆盖默认规则
  rules: {
    // 例如，忽略 @tailwind 指令的未知规则错误
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    // 其他自定义规则...
  },
};
