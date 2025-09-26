// ==UserScript==
// @name         清华社英语在线-重制版
// @version      0.0.3
// @description  本版本进行webpack初始化
// @author       FmCoral
// @match        *://www.tsinghuaelt.com/*
// @run-at       document-start
// @icon         https://github.com/FmCoral/tsinghuaelt/raw/main/logo.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addElement
// @resource     jquery https://code.jquery.com/jquery-3.5.1.min.js
// @connect      *
// @updateURL    https://github.com/FmCoral/tsinghuaelt
// @downloadURL  https://github.com/FmCoral/tsinghuaelt
// ==/UserScript==

console.log('[Coral]正在从CDN加载jQuery-3.5.1');
const script = document.createElement('script'); //创建一个script标签
script.onload = function () {
    console.log('[Coral]成功加载jQuery-3.5.1'); //加载完成后输出结果
    autoClass(); //执行函数内的操作
};
script.onerror = function () {
    console.error('[Coral]jQuery-3.5.1加载失败！'); //错误提示
};
script.src = 'https://code.jquery.com/jquery-3.5.1.min.js'; //设置script的地址

document.head.appendChild(script); //将脚本植入到页面head部分

function autoClass() {
/******/ (() => { // webpackBootstrap - Webpack启动引导
/******/  "use strict"; // 启用严格模式，提高代码安全性
/******/  var __webpack_modules__ = ({ // 定义所有模块的集合

/***/ 987:
/***/ (() => { // 模块987 - 工具函数模块



                    /***/
                })

            /******/
        });
/************************************************************************/
/******/  // 模块缓存系统 - 存储已加载的模块，避免重复执行
/******/  var __webpack_module_cache__ = {};
/******/
/******/  // 模块加载函数 - 核心的require功能
/******/  function __webpack_require__(moduleId) {
/******/    // 检查模块是否已在缓存中
/******/    var cachedModule = __webpack_module_cache__[moduleId];
/******/    if (cachedModule !== undefined) {
/******/      return cachedModule.exports; // 如果已缓存，直接返回缓存结果
                /******/
            }
/******/    // 创建新模块并放入缓存
/******/    var module = __webpack_module_cache__[moduleId] = {
/******/      // 不需要模块ID
/******/      // 不需要模块加载状态
/******/      exports: {} // 模块的导出对象
                /******/
            };
/******/
/******/    // 执行模块函数
/******/    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/    // 返回模块的导出内容
/******/    return module.exports;
            /******/
        }
        /******/
        /************************************************************************/
        // 这个入口需要被IIFE包裹，以便与其他模块隔离
        (() => {

            ;// 合并的模块: ./src/utils.js - 工具函数模块

            function input_in(e, txt) {
                if (e.type == 'textarea') {
                    e.value = txt;
                } else {
                    e.innerText = txt;
                }
                let changeEvent = null;
                changeEvent = document.createEvent("HTMLEvents");
                changeEvent = new Event("input", { bubbles: true, cancelable: true });
                e.dispatchEvent(changeEvent);

                changeEvent = document.createEvent("HTMLEvents");
                changeEvent = new Event("keyup", { bubbles: true, cancelable: true });
                e.dispatchEvent(changeEvent);

                changeEvent = document.createEvent("HTMLEvents");
                changeEvent = new Event("change", { bubbles: true, cancelable: true });
                e.dispatchEvent(changeEvent);
            }
        }



    )();
});
}
