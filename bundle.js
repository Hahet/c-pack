(function(modules) {
  //创建require函数， 它接受一个模块ID（这个模块id是数字0，1，2） ，它会在我们上面定义 modules 中找到对应是模块.
  function require(id) {
    const [fn, mapping] = modules[id];
    function localRequire(relativePath) {
      //根据模块的路径在mapping中找到对应的模块id
      return require(mapping[relativePath]);
    }
    const module = { exports: {} };
    //执行每个模块的代码。
    fn(localRequire, module, module.exports);
    return module.exports;
  }
  //执行入口文件，
  require(0);
})({
  0: [
    function(require, module, exports) {
      "use strict";

      var _hello = _interopRequireDefault(require("./hello.js"));

      var _message = require("./message.js");

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var s = "chaos";
      var w = "[".concat(_message.world, "]");
      console.log(_hello["default"], s, w);
    },
    { "./hello.js": 1, "./message.js": 2 }
  ],
  1: [
    function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;

      var _message = require("./message.js");

      var hello = "hello" + _message.world;
      var _default = hello;
      exports["default"] = _default;
    },
    { "./message.js": 3 }
  ],
  2: [
    function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.world = void 0;
      var world = "world";
      exports.world = world;
    },
    {}
  ],
  3: [
    function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.world = void 0;
      var world = "world";
      exports.world = world;
    },
    {}
  ]
});
