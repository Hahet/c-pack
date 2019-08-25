# c-pack

> 精简的 webpack 打包器， 理解打包的基本原理

# bundler.js： 打包器代码
- createAsset：创建单个文件的资源，包括，文件名 模块id， 依赖文件，源代码（使用babel进行了编译至es5）
- createGraph 使用广度遍历，把所有依赖收集到一个数组 graph
- bundle 根据 graph 生成 打包后的代码
  - 使用立即执行函数， 将模块作为参数传入该函数
  - require 根据 id 去 获取模块内的依赖
- require & export 的实现：通过将 module， module.exports传入对应模块的函数可以取到 模块内的 export 的 变量。 然后 每个require函数会将 module.exports 作为返回值。这样其他模块 require 当前模块时， 就可以取到当前模块导出的变量
  
