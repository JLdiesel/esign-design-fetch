module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
  ],
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
