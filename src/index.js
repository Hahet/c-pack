// index.js
// var add = require('./add.js').add
// console.log(add(1 , 2))
// const sum = add(1,2)
// exports.sum = sum
// ----------
// const modules = {
//   a: function(){
//     // a.js
//     const a = 1
//     console.log('a', a, b)
//   },
//   b: function(){
//     // b.js
//     const b = 2
//     console.log('b', b)
//   },
// }


// (function(mds){
  
// })(modules)



// 模块
const modules = {
  './index.js': {
    code: function(require, module, exports){
      // 插入 index.js 模块的代码
      var add = require('./add.js').add
      console.log(add(1 , 2))
      const sum = add(1,2)
      exports.sum = sum
    },
  },
  './add.js': {
    code: function(require, module, exports){
      // add.js
      exports.add = function(a,b) {return a + b}
    },
  }
};
// 入口
(function(modules){
  // 其实是一个闭包， require 函数会用到 modules
  function require(mid){
    const m = modules[mid]
    const moduleFunction = m.code
    const module = { exports: {} }
    // 将 module 和 exports 传给 moduleFunction， moduleFunction 运行代码，会改变 exports 的值
    moduleFunction(require, module, module.exports)
    // 返回
    return module.exports
  }
  // 入口文件
  require('./index.js')
})(modules)

// 这就完成了模块的拆分和运行
// modules 目前是我们写死的，需要我们通过源码模块质检的依赖来构建。 