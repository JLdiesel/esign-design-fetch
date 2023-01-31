import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser' // 读取 package.json 配置
import pkg from './package.json' // 当前运行环境，可通过 cross-env 命令行设置
import { defineConfig } from 'rollup'
import { uglify } from 'rollup-plugin-uglify'
// eslint-disable-next-line no-undef
const env = '' // umd 模式的编译结果文件输出的全局变量名称
const config = defineConfig({
  // 入口文件，src/index.ts
  // eslint-disable-next-line no-undef
  input: path.resolve(__dirname, 'index.ts'),

  // 输出文件
  output: [
    // commonjs
    {
      // package.json 配置的 main 属性
      file: pkg.main,
      format: 'commonjs',
    },
    // es module
  ],
  external: ['source-map', '@babel/parser', 'estree-walker'],
  plugins: [
    // rollup 编译 typescript
    rollupTypescript(),
    json(),
    // 解析第三方依赖
    resolve(),
    // 识别 commonjs 模式第三方依赖
    commonjs({
      sourcemap: false,
    }),

    // babel 配置
    babel({
      // 编译库使用
      babelHelpers: 'runtime',
      // 只转换源代码，不转换外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
    }),
  ],
})
// 若打包正式环境，压缩代码
if (env === 'production') {
  config.plugins.push(
    uglify(),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  )
}

export default config
