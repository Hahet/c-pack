
  (function(modules){
    // 其实是一个闭包， require 函数会用到 modules
    function require(mid){
      const m = modules[mid]
      const {code: moduleFunction, mapping} = m
      const module = { exports: {} }
      function pathRequire(path){
        const mid =  mapping[path]
        return require(mid)
      }
      // 将 module 和 exports 传给 moduleFunction， moduleFunction 运行代码，会改变 exports 的值
      moduleFunction(pathRequire, module, module.exports)
      // 返回
      return module.exports
    }
    // 入口文件
    require(0)
  })({0:{
      code: function (require, module, exports){
        "use strict";

        var _utils = require("./utils.js");

        console.log((0, _utils.add)(2, 2));
        var sum = (0, _utils.add)(2, 3);
        exports.sum = sum;
      },
      mapping: {"./utils.js":1}
    },1:{
      code: function (require, module, exports){
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.add = void 0;

        // add.js
        var add = function add(a, b) {
          return a + b;
        };

        exports.add = add;
      },
      mapping: {}
    },})
  