module.exports = {
  plugins: [
    [
      // 与 babelHelpers: 'runtime' 配合使用
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
}
