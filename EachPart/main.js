/*
 * 清华社英语在线-主逻辑文件
 * 版本: 1.0.2
 * 最后更新: 2025年9月29日
 * 作者: FmCoral
 * 描述: 主逻辑
 */


// 版本信息
const MAIN_VERSION = '1.0.2';

console.log('🚀 主逻辑运行中...');

// 将重要信息显示到状态栏
if (window.logToStatusBar) {
    window.logToStatusBar('🚀 主逻辑运行中...');
}

function executeWebpack() {
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 987:
/***/ (() => {
                    /***/
                })
            /******/
        });

/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
                /******/
            }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
                /******/
            };
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
            /******/
        }
        /******/
        /************************************************************************/
        // 由于 `__webpack_exports__` 已声明但从未使用，移除该声明
        // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
        (() => {

            const submitDelay = 3000;       // Submit 之后的等待时间
            const pageNextDelay = 5000;     // 换页 之后的等待时间
            const inputDelay = 500;         // 输入 之后的等待时间

            const allauto = ['auto_tiankong', 'auto_luyin', 'auto_lytk', 'auto_danxuan', 'auto_dropchoose', 'auto_drag', 'auto_video', 'auto_duoxuan', 'auto_judge'];
            let user_config = {
                'autodo': ['auto_tiankong', 'auto_luyin', 'auto_danxuan', 'auto_dropchoose', 'auto_drag', 'auto_video', 'auto_duoxuan', 'auto_judge'],
                'autotryerr': true,
                'autostop': false,
                'autorecord': true,
                'delay': 10000
            };

            // 题型设置函数
            async function setTixing(t) {
                console.log('[+] 题型:', t);
                
                // 使用专用函数显示信息到状态栏
                if (window.logToStatusBar) {
                    window.logToStatusBar('当前题型：' + t);
                } else if (window.TsinghuaELTUtils && window.TsinghuaELTUtils.StatusBar) {
                    window.TsinghuaELTUtils.StatusBar.addMessage('当前题型：' + t);
                } else {
                    $('#yun_status').text('当前题型：' + t);
                }
            }




            // 填空题
            async function doTianKong() {
                // 设置题型
                await setTixing('填空题');
                
                // 调用utils.js中的填空题答题逻辑
                if (window.TsinghuaELTUtils && window.TsinghuaELTUtils.doTianKone) {
                    await window.TsinghuaELTUtils.doTianKone(inputDelay, submitDelay);
                } else {
                    console.error('utils.js未加载或doTianKone函数不存在');
                }
            }



    })();
    /******/
}) (); // webpackBootstrap结束
} // executeWebpack函数结束

console.log('🚀 主逻辑运行中...');

// 将重要信息显示到状态栏
if (window.logToStatusBar) {
    window.logToStatusBar('🚀 主逻辑运行中...');
}

