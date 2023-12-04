// .eslintrc.js
module.exports = {
  // Umi 项目
  extends: require.resolve('umi/eslint'),

  // Umi Max 项目
  // extends: require.resolve('@umijs/max/eslint'),
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
};
