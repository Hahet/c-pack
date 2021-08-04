## src 目录说明

test.html 测试用，可以浏览器打开测试
builder.js 简易 webpack 核心代码, 可以 node 直接运行， 也可以使用 vscode debug
bundle.js 打包之后的代码， test.html 中引用
app.js 入口 js
其他文件：讲解、测试用的

## 前端模块化思路

nodejs 有模块 cjs （babel es6->es5 的时候会将 esm 转 cjs）
但是浏览器端无法直接使用，原因有两个

- 浏览器无法读文件
- 浏览器没有实现模块的加载系统（cjs）

### 浏览器无法读文件

浏览器无法像 node 一样直接读文件，所以 浏览器的模块依赖需要放到内存中：打包生成一个模块依赖图来存所有模块

### 浏览器没有实现模块的加载系统

#### 如何拆分模块

因为我们希望模块能进行隔离，比如每个模块定义变量不要污染全局。我们需要将每个模块的代码包裹在一个函数中，做到模块的隔离

```js
function(){
  // 插入 index.js 模块的代码
  var add = require('./add.js').add
  console.log(add(1 , 2))
  const sum = add(1,2)
  exports.sum = sum
}
```

cjs 模块中会用到 require， exports 没有定义。nodejs 全局环境中内置了，可以直接用。我们这里需要传入函数

```js
function(require, module, exports){
  // 插入 index.js 模块的代码
  var add = require('./add.js').add
  console.log(add(1 , 2))
  const sum = add(1,2)
  exports.sum = sum
}
```

在浏览器模拟 cjs

- require: 是个函数，根据依赖路径，返回对应模块导出的变量 （exports）
- exports: 对象 模块导出的变量挂在 exports 上
- module: module = { exports: {} }

```js
// 模块
const modules = {
  "./index.js": {
    code: function (require, module, exports) {
      // 插入 index.js 模块的代码
      var add = require("./add.js").add;
      console.log(add(1, 2));
      const sum = add(1, 2);
      exports.sum = sum;
    },
  },
  "./add.js": {
    code: function (require, module, exports) {
      // add.js
      exports.add = function (a, b) {
        return a + b;
      };
    },
  },
};
// 入口
(function (modules) {
  // 其实是一个闭包， require 函数会用到 modules
  function require(mid) {
    const m = modules[mid];
    const moduleFunction = m.code;
    const module = { exports: {} };
    // 将 module 和 exports 传给 moduleFunction， moduleFunction 运行代码，会改变 exports 的值
    moduleFunction(require, module, module.exports);
    // 返回
    return module.exports;
  }
  // 入口文件
  require("./index.js");
})(modules);
```

这样可以运行， 但是我们直接将 path 当做模块的 id 是不可行的。
比如 src/test 目录下 `import { a } from './add' `,
和 src 目录下 `import { a } from './add' `,
其实不是同一个模块了，如果使用 `./add ` 做模块 id 就会导致前一个模块被覆盖
所以需要给每一个模块加一个单独的 id（通过一个全局变量自增生成）
这样做之后 我们的 require 函数实现就需要改变了

```js
(function (modules) {
  // 其实是一个闭包， require 函数会用到 modules
  function require(mid) {
    const m = modules[mid];
    const { code: moduleFunction, mapping } = m;
    const module = { exports: {} };
    function pathRequire(path) {
      const mid = mapping[path];
      return require(mid);
    }
    // 将 module 和 exports 传给 moduleFunction， moduleFunction 运行代码，会改变 exports 的值
    moduleFunction(pathRequire, module, module.exports);
    // 返回
    return module.exports;
  }
  // 入口文件
  require(0);
})({
  0: {
    code: function (require, module, exports) {
      "use strict";

      var _utils = require("./utils.js");

      console.log((0, _utils.add)(2, 2));
      var sum = (0, _utils.add)(2, 3);
      exports.sum = sum;
    },
    mapping: { "./utils.js": 1 },
  },
  1: {
    code: function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.add = void 0;

      // add.js
      var add = function add(a, b) {
        return a + b;
      };

      exports.add = add;
    },
    mapping: {},
  },
});
```

如上，我们 require 函数的是根据 mid 返回 模块导出的对象。
但是代码中使用的 require 是根据 path 返回 模块导出的对象。
所以我们重新定义了一个 pathRequire 来做这个。
pathRequire 会根据 path 找到 mid（需要我们加每个模块其依赖项路径到模块的映射）， 然后调用 require(mid)

### 模块依赖树构建

#### 单个模块解析 createAsset ：

- 我们使用 babylon 解析 源码：源码字符串 -> AST（用对象表示程序代码）
- 使用 traverse 遍历 ast，ImportDeclaration 代表的就是 import 语句， 这样可以找到所有依赖项
- 通过 babel.transformFromAstSync：es6 -> es5，生成装换后的 code
- 然后返回 { dependencies, id, code, filename }

#### 所有模块的依赖树 createGraph

通过 createAsset 我们可以构建单个模块的 { dependencies, id, code, filename }
所以我们只需要从入口文件开始处理，然后处理入口文件 dependencies，本质上就是树的遍历（暂不考虑循环依赖），我这里使用的 广度遍历
注意我们在构建树的过程中，添加了 mapping， 即 pathRequire 函数中 需要用的 路径到 模块的映射关系

```js
const createGraph = (entry) => {
  const mainAsset = createAsset(entry);

  //既然要广度遍历肯定要有一个队列，第一个元素肯定是 从 "./index.js" 返回的信息
  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    //新增一个属性来保存 require 的路径和对应模块的映射
    //保存类似 这样的数据结构 --->  {"./message.js" : 1}
    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);

      //获得子依赖（子模块）的依赖项、代码、模块id，文件名
      const child = createAsset(absolutePath);
      //给子依赖项赋值，路径与模块的对应关系
      asset.mapping[relativePath] = child.id;
      //将子依赖也加入队列中，广度遍历
      queue.push(child);
    });
  }
  return queue;
};
```
