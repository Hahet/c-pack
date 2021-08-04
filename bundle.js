
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
  })(0:{
      code: function (require, module, exports){
        "use strict";

var _utils = _interopRequireDefault(require("./utils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log((0, _utils["default"])(2, 2));
var sum = (0, _utils["default"])(2, 3);
exports.sum = sum;
      },
    },1:{
      code: function (require, module, exports){
        "use strict";

// add.js
exports.add = function (a, b) {
  return a + b;
};
      },
    },)
  