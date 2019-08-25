# c-pack

> 精简的 webpack 打包器， 理解打包的基本原理
# 思路： 
1. 读取文件（模块），得到代码的字符串 code
2. 使用 @babel/parser 将 code 字符串解析为 ast。
3. 使用 @babel/traverse 遍历 ast， 遇到 ImportDeclaration 类型的，就加入依赖
4. 再用 @babel/core 的 transformFromAstSync， 实现 es6 转 es5
5. 然后返回包括，文件名 模块id， 依赖文件，源代码的对象。 这样一个文件的代码编译， 依赖收集就完成了
6. 从入口开始分析所有依赖项，形成依赖图，采用广度遍历。 这样就生成了依赖图（数组）
7. 根据生成的依赖关系图，生成对应环境能执行的代码。 require & export 在这里实现


# bundler.js： 打包器代码
- createAsset：创建单个文件的资源，包括，文件名 模块id， 依赖文件，源代码（使用babel进行了编译至es5）
- createGraph 使用广度遍历，把所有依赖收集到一个数组 graph
- bundle 根据 graph 生成 打包后的代码
  - 使用立即执行函数， 将模块作为参数传入该函数
  - require 根据 id 去 获取模块内的依赖
- require & export 的实现：通过将 module， module.exports传入对应模块的函数可以取到 模块内的 export 的 变量。 然后 每个require函数会将 module.exports 作为返回值。这样其他模块 require 当前模块时， 就可以取到当前模块导出的变量
  
