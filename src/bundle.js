
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

var _index = _interopRequireDefault(require("./test/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log((0, _utils.add)(2, _index["default"]));
var sum = (0, _utils.add)(2, 3);
exports.sum = sum;
      },
      mapping: {"./utils.js":1,"./test/index.js":2}
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
    },2:{
      code: function (require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _add = require("./add.js");

var b = _add.a + 1;
console.log('test', b);
var _default = b;
exports["default"] = _default;
      },
      mapping: {"./add.js":3}
    },3:{
      code: function (require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = void 0;
var a = 100;
exports.a = a;
console.log('test/add', a);
      },
      mapping: {}
    },})
  