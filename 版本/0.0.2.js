// ==UserScript==
// @name         清华社英语在线-重制版
// @version      0.0.2
// @description  本版本进行编写UserScript头部
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
script.onload = function() {
    console.log('[Coral]成功加载jQuery-3.5.1'); //加载完成后输出结果
    autoClass(); //执行函数内的操作
};
script.onerror = function() { 
    console.error('[Coral]jQuery-3.5.1加载失败！'); //错误提示
};
script.src = 'https://code.jquery.com/jquery-3.5.1.min.js'; //设置script的地址

document.head.appendChild(script); //将脚本植入到页面head部分

(function() {
    'use strict';

    // Your code here...
})();