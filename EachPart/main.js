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

        ;// CONCATENATED MODULE: ./src/utils.js
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

        function mouseEvent(div, type, pos) {
            var mousedown = document.createEvent("MouseEvents");

            let x = 0;
            let y = 0;
            if (pos == undefined) {
                let rect = div.getBoundingClientRect();
                x = (rect.x * 2 + rect.width) / 2;
                y = (rect.y * 2 + rect.height) / 2;
            } else {
                x = pos.x;
                y = pos.y;
            }

            mousedown.initMouseEvent(type, true, true, unsafeWindow, 0,
                x, y, x, y, false, false, false, false, 0, null);
            div.dispatchEvent(mousedown);
        }

        async function dragTo(from, to) {
            try {
                console.log('[+] 开始拖动操作');

                // 获取拖块容器并滚动到合适位置
                let dragBlock = $(".lib-drag-block");
                if (dragBlock.length > 0) {
                    // 改进的滚动逻辑：确保目标元素完全可见
                    const targetOffsetTop = to.offsetTop;
                    const targetHeight = to.offsetHeight;
                    const containerHeight = dragBlock[0].offsetHeight;

                    // 计算需要滚动的距离，确保目标元素在可视区域中间
                    const scrollTop = targetOffsetTop - (containerHeight / 2) + (targetHeight / 2);
                    dragBlock.scrollTop(scrollTop);

                    // 额外检查：如果目标元素仍然不可见，再次调整滚动
                    await sleep(200);
                    const toRect = to.getBoundingClientRect();
                    const containerRect = dragBlock[0].getBoundingClientRect();

                    // 如果目标元素不在可视区域内，进一步调整滚动
                    if (toRect.bottom > containerRect.bottom || toRect.top < containerRect.top) {
                        console.log('[+] 目标元素不可见，进一步调整滚动位置');
                        dragBlock.scrollTop(scrollTop + (toRect.top < containerRect.top ? -100 : 100));
                    }

                    $(document).scrollTop(dragBlock[0].offsetTop);
                }

                await sleep(300); // 滚动后等待时间

                // 计算精确的拖动位置（从拖块中心到答案框中心）
                const fromRect = from.getBoundingClientRect();
                const toRect = to.getBoundingClientRect();

                const fromCenterX = fromRect.left + fromRect.width / 2;
                const fromCenterY = fromRect.top + fromRect.height / 2;
                const toCenterX = toRect.left + toRect.width / 2;
                const toCenterY = toRect.top + toRect.height / 2;

                console.log(`[+] 拖动位置: (${fromCenterX}, ${fromCenterY}) -> (${toCenterX}, ${toCenterY})`);

                // 鼠标按下
                mouseEvent(from, 'mousedown', { x: fromCenterX, y: fromCenterY });
                await sleep(200); // 鼠标按下后等待时间

                // 模拟更平滑的拖动过程 - 分多步移动
                const steps = 5;
                for (let i = 1; i <= steps; i++) {
                    const progress = i / steps;
                    const currentX = fromCenterX + (toCenterX - fromCenterX) * progress;
                    const currentY = fromCenterY + (toCenterY - fromCenterY) * progress;

                    mouseEvent(to, 'mousemove', { x: currentX, y: currentY });
                    await sleep(80); // 每步移动间隔
                }

                // 最终精确定位到目标中心
                mouseEvent(to, 'mousemove', { x: toCenterX, y: toCenterY });
                await sleep(100);

                // 鼠标释放
                mouseEvent(to, 'mouseup', { x: toCenterX, y: toCenterY });
                await sleep(200); // 鼠标释放后等待时间

                console.log('[+] 拖动操作完成');
                return true;
            } catch (error) {
                console.error('[!] 拖动操作出错:', error);
                return false;
            }
        }

        function extendConsole(console, isDebug) {
            "use strict";

            /**
             * @description 获取样式的颜色值
             * @param {String} type - 样式名称 [ primary | success | warning | error | text ]
             * @return {String} String - 返回颜色值
             */
            function typeColor(type) {
                type = type || '';
                let color = '';
                switch (type) {
                    case 'primary': color = '#2d8cf0'; break; //蓝
                    case 'success': color = '#19be6b'; break; //绿
                    case 'warning': color = '#ff9900'; break; //黄
                    case 'error': color = '#ed4014'; break; //红
                    case 'text': color = '#000000'; break; //黑
                    default: color = '#515a6e'; break; //灰
                }
                return color;
            }

            /**
            * @description 打印一个 [ title | text ] 胶囊型样式的信息
            * @param {String} title - title text
            * @param {String} info - info text
            * @param {String} type - style
            */
            console.capsule = function (title, info, type = 'primary', ...args) {
                //Js字符串拼接 ${ }
                console.log(
                    `%c ${title} %c ${info} %c`,
                    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
                    `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
                    'background:transparent', ...args
                );
            };

            /**
            * @description 打印丰富多彩的文字
            * @param {String} value - 打印值
            * @param {String} style - style样式
            */
            console.colorful = function (value, style, ...args) {
                console.log(
                    `%c ${value || ""}`, `${style || ""}`, ...args
                );
            };

            /**
            * @description 打印 default 样式的文字
            * @param {String} value - 打印值
            */
            console.default = function (value, ...args) {
                console.colorful(value, `color: ${typeColor("default")};`, ...args);
            };

            /**
            * @description 打印 primary 样式的文字
            * @param {String} value - 打印值
            */
            console.primary = function (value, ...args) {
                console.colorful(value, `color: ${typeColor("primary")};`, ...args);
            };

            /**
            * @description 打印 success 样式的文字
            * @param {String} value - 打印值
            */
            console.success = function (value, ...args) {
                console.colorful(value, `color: ${typeColor("success")};`, ...args);
            };

            /**
            * @description 打印 warning 样式的文字
            * @param {String} value - 打印值
            */
            console.warning = function (value, ...args) {
                console.colorful(value, `color: ${typeColor("warning")};`, ...args);
            };

            /**
            * @description 打印 error 样式的文字
            * @param {String} value - 打印值
            */
            console.error = function (value, ...args) {
                console.colorful(value, `color: ${typeColor("error")};`, ...args);
            };

            /**
            * @description 打印 3D 样式的文字
            * @param {String} value - 打印值
            */
            console.text3D = function (value, ...args) {
                //let style = "font-size:5em;color:red;font-weight:bolder;text-shadow:5px 5px 2px #fff, 5px 5px 2px #373E40, 5px 5px 5px #A2B4BA, 5px 5px 10px #82ABBA;"
                let style = "color: #393D49;font-size:2.5em;font-weight:bolder;text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.1),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);";
                console.colorful(value, style, ...args);
            };

            /**
            * @description 打印 彩色 样式的文字
            * @param {String} value - 打印值
            */
            console.rainbow = function (value, ...args) {
                let style = 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;';
                console.colorful(value, style, ...args);
            };

            /**
            * @description 打印 图片
            * @param {String} imgUrl - 图片路径
            * @param {String} padding - padding值
            */
            console.picture = function (imgUrl, padding, ...args) {
                let style = `padding:${padding || "0px"};background:url('${imgUrl || ""}') no-repeat center;`;
                console.log(
                    `%c `, `${style || ""}`, ...args
                );
            };

            /**
            * @description 打印 分组 console.group
            * @param {String} groupName - 组名
            * @param {Array} obj - 对象
            */
            console.groupBy = function (groupName, obj, ...args) {
                obj = obj || {};
                //#9E9E9E #03A9F4  #4CAF50 #6a6b6d
                let style = `color: #9E9E9E; font-weight: bold`;

                console.group(`${groupName}`);
                for (let key in obj) {
                    console.log(`%c ${key} :`, `${style || ""}`, obj[key], ...args);
                }
                console.groupEnd();
            };

            /**
            * @description 打印 Object和Array等引用类型，打印的是该类型的值，而不是打印引用地址的值（[object Object] 、[object Array]）
            */
            console.print = function (...args) {
                try {
                    let arr = [];
                    arr.push(...args);
                    arr.forEach((item, index) => {
                        if (Object.prototype.toString.call(item) === '[object Object]' || Object.prototype.toString.call(item) === '[object Array]') {
                            arr[index] = JSON.parse(JSON.stringify(item));
                        }
                    });
                    console.log(...arr);
                } catch (e) {
                    console.error(`logger error: ${e}`);
                }
            };


            //是否调试模式，非调试模式不输出
            isDebug = isDebug || false;
            if (!isDebug) {
                for (let key in console) {
                    console[key] = function () { };
                }
                return;
            }

        }

        let vocabulary = ['fantastic', 'error', 'whatsoever', 'arouse', 'magnificent', 'remarkable', 'schoolwork', 'ease', 'devil', 'factor', 'outstanding', 'infinite', 'infinitely', 'accomplish', 'accomplished', 'mission', 'investigate', 'mysterious', 'analysis', 'peak', 'excellence', 'credit', 'responsibility', 'amount', 'entertain', 'alternative', 'irregular', 'grant', 'cease', 'concentration', 'adapt', 'weird', 'profit', 'alter', 'performance', 'echo', 'hallway', 'await', 'abortion', 'database', 'available', 'indecision', 'ban', 'predict', 'breakthrough', 'fate', 'host', 'pose', 'instance', 'expert', 'surgery', 'naval', 'aircraft', 'target', 'spoonful', 'navigation', 'numerous', 'fluent', 'mechanic', 'advertise', 'advertising', 'waken', 'enormous', 'enormously', 'oversleep', 'survey', 'best-selling', 'filmmaker', 'prosperous', 'involve']
        let phrases = ['Yes, he is', 'No, he isn\'t', 'Yes', 'No']
        let getRanWord = () => { return vocabulary[parseInt(Math.random() * vocabulary.length)] }
        let getRanPhrase = () => { return phrases[parseInt(Math.random() * phrases.length)] }
        let sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }
        let click_btn = () => { $('.wy-course-bottom .wy-course-btn-right .wy-btn').click(); }


            ;// CONCATENATED MODULE: ./src/config.js
        // 下方时间你可以根据你的网络情况酌情调整
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


        ;// CONCATENATED MODULE: ./src/hook.js


        let uploadToken, recordDetail;

        function initHook() {
            // Hook 播放器
            let ori_create_player = unsafeWindow['Aliplayer'];
            Object.defineProperty(unsafeWindow, 'Aliplayer', {
                set: (v) => {
                    ori_create_player = v;
                },
                get: () => {
                    return function (config) {
                        unsafeWindow['yunPlayer'] = ori_create_player(config);
                        console.log('[Yun]', 'getPlayer:', unsafeWindow['yunPlayer']);
                        return unsafeWindow['yunPlayer'];
                    };
                }
            });

            // Hook Chivox
            let ori_chivox = {
                get AiPanel() {
                    return this.$AiPanel;
                },
                get AiRecorder() {
                    return this.$AiRecorder;
                },
                set AiPanel(n) {
                    this.$AiPanel = class myAiPanel extends n {
                        constructor(config) {
                            let ret = super(config);
                            console.log('[Yun]', 'init AiPanel:', config, ret);
                            return ret;
                        }
                    };
                },
                set AiRecorder(n) {
                    this.$AiRecorder = class myAiRecorder extends n {
                        constructor(config) {
                            let ret = super(config);
                            console.log('[Yun]', 'init AiRecorder:', config, ret);
                            unsafeWindow['yunAiRecorder'] = ret;
                            return ret;
                        }
                    };
                }
            };
            Object.defineProperty(unsafeWindow, 'chivox', {
                get: () => {
                    return ori_chivox;
                }
            });

            // Hook HTTP Request
            let ori_xmlHttpReq = unsafeWindow['XMLHttpRequest'];
            class myXMLHttpRequest extends ori_xmlHttpReq {
                get addEventListener() {
                    return (type, listener, ...arg) => {
                        if (type === 'load' || type === 'readystatechange') {
                            let ori_listener = listener;
                            listener = (event) => {
                                if (this.readyState !== ori_xmlHttpReq.DONE || this.status !== 200) {
                                    ori_listener.call(this, event);
                                    return;
                                }
                                if (this.uri.startsWith('/tsenglish/resource/getUploadToken')) {
                                    let data = JSON.parse(this.responseText);
                                    uploadToken = data['object']['token'];
                                    console.success('uploadToken:', uploadToken);
                                }
                                if (this.uri.startsWith('/tsenglish/exercise/recordDetail')) {
                                    let data = JSON.parse(this.responseText);
                                    recordDetail = data?.object?.exercise;
                                    console.success('Record Detail:', recordDetail);
                                }
                                if (this.uri) console.log('[Yun]', 'HTTP 200:', this.uri);
                                ori_listener.call(this, event);
                            }
                        }
                        return super.addEventListener(type, listener, ...arg)
                    };
                }

                open(method, url, async, username, password) {
                    // console.log('hook-> ', url, async);
                    const uri_reg = /^(\/[a-zA-Z0-9].*$)/.exec(url);
                    const uri_host_reg = /tsinghuaelt.com(\/.*$)/.exec(url);
                    this.uri = uri_reg ? uri_reg[1] : uri_host_reg ? uri_host_reg[1] : '';
                    if (async === undefined) async = true;
                    return super.open(method, url, async, username, password);
                };

                send(body) {
                    if (this.uri.startsWith('/tsenglish/exercise/submit')) {
                        let data = JSON.parse(body);
                        console.success('Submit:', data);
                        return super.send(JSON.stringify(data));
                    }

                    return super.send(body);
                };

            }

            Object.defineProperty(unsafeWindow, 'XMLHttpRequest', {
                set: (v) => { ori_xmlHttpReq = v; },
                get: () => { return myXMLHttpRequest; }
            });

            // Hook Websocket
            let ori_webSocket = unsafeWindow['WebSocket'];
            class myWebSocket extends ori_webSocket {
                set onmessage(n) {
                    super.onmessage = n;
                }
                get addEventListener() {
                    return (type, listener, ...arg) => {
                        console.log('[Yun]', 'WebSocket addEventListener:', type, listener);
                        if (this.url.startsWith('wss://cloud.chivox.com/en.sent.score') && type === 'message') {
                            let ori_listener = listener;
                            listener = (event) => {
                                let data = JSON.parse(event.data);
                                console.log('[Yun]', 'WebSocket Recv:', this.url, data);
                                // Object.defineProperty(event, 'data', {get(){return JSON.stringify(data);}})
                                ori_listener(event);
                            }
                        }
                        return super.addEventListener(type, listener, ...arg)
                    };
                }
                send(data) {
                    if (typeof data == 'object') { // 发送语音
                        if (!this.doing_topic) return;
                        $.ajax({
                            url: `https://open.izhixue.cn/resource/web/url`,
                            type: "get",
                            async: false,
                            data: {
                                token: uploadToken,
                                resourceId: this.doing_topic.audio
                            },
                            success: (response) => {
                                const onload = async (e) => {
                                    if (!e.status && e.target) e = e.target;
                                    if (e.status == 200) {
                                        for (let i = 0; i < e.response.byteLength; i += 3840) {
                                            super.send(e.response.slice(i, i + 3840));
                                            await sleep(40);
                                        }

                                        super.send(new ArrayBuffer(0));
                                        console.success('发送标准答案成功！');
                                    } else {
                                        console.error('[Yun]', 'Wtf?', e);
                                    }
                                };
                                const error = (err) => {
                                    console.error('[Yun]', 'get Audio Fail', err);
                                    super.send(new ArrayBuffer(0));
                                };
                                const fallback = (err) => {
                                    console.error('尝试使用 GM_xmlhttpRequest 失败:', err);
                                    var xhr = new XMLHttpRequest();
                                    xhr.open('GET', response.data.PlayAuth, true);
                                    xhr.withCredentials = false;
                                    xhr.responseType = 'arraybuffer';
                                    xhr.onerror = error;
                                    xhr.onload = onload;
                                    xhr.send();
                                }
                                try {
                                    window.GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: response.data.PlayAuth,
                                        onload: onload,
                                        onerror: fallback,
                                        onabort: fallback,
                                        responseType: 'arraybuffer'
                                    });
                                } catch (err) {
                                    fallback(err);
                                }
                            },
                            error: (err) => {
                                console.error('[Yun]', 'get Audio Info Fail', err);
                            }
                        });
                        this.doing_topic = undefined;
                        return;
                    }
                    if (typeof data == 'string') {
                        let json = JSON.parse(data);
                        if ('request' in json && json.request.refText) {
                            if (!recordDetail.sentItems && recordDetail?.exerciseList[0]?.sentItems) {
                                recordDetail.sentItems = [];
                                for (const exercise of recordDetail.exerciseList) {
                                    exercise.sentItems.forEach((item) => {
                                        recordDetail.sentItems.push(item);
                                    });
                                }
                            }
                            for (const item of recordDetail.sentItems) {
                                if (item.text.replace(/[ \\.!,'\\?]/g, '').toLowerCase() == json.request.refText.replace(/[ \\.!,'\\?]/g, '').toLowerCase()) {
                                    this.doing_topic = item;
                                    console.success('Doing Topic:', item);
                                    break;
                                }
                            }
                            if (!this.doing_topic) console.error('[Yun]', 'Buggggg here~ Please open a issue on gayhub and paste:', json);
                        }
                        data = JSON.stringify(json);
                    }
                    console.log('[Yun]', 'WebSocket Send:', this.url, data);
                    return super.send(data);
                }
            }

            Object.defineProperty(unsafeWindow, 'WebSocket', {
                set: (v) => { ori_webSocket = v; },
                get: () => { return myWebSocket; }
            });
        }
        ;// CONCATENATED MODULE: ./src/topic_dom.js



        // 填空题
        async function doTianKone() {
            // 先填写随机单词，获得答案

            let inputs = $('.lib-fill-blank-do-input-left');
            $.each(inputs, function (i, item) {
                input_in(item, getRanWord());
            });

            await sleep(inputDelay);
            click_btn(); // Submit
            await sleep(submitDelay);

            let answer = [], anyAnswer = false;
            $('.lib-edit-score span[data-type="1"]').each((i, item) => {
                if (item.innerText.toLowerCase().indexOf('vary') != -1) {
                    // 任意填空
                    anyAnswer = true;
                    return false;
                }
                answer.push(item.innerText)
            });

            if (anyAnswer) {
                return;
            }

            click_btn(); // Retry
            await sleep(submitDelay);

            // 提交正确答案
            inputs = $('.lib-fill-blank-do-input-left');
            $(inputs).each((i, item) => {
                input_in(item, answer[i]);
            });

            await sleep(inputDelay);
        }

        // 录音题
        async function doReadRepeat() {
            let sum_record = 0;

            if ($('.lib-oral-container-top').length != 0) {
                var rec_div = $('.lib-oral-container-top')
            } else {
                var rec_div = $('.lib-listen-item-right-img')
            }

            rec_div.each((i, div) => {
                if ($(div).find('img[title="播放"]').length != 0) {
                    return true;
                };

                // 检查是否有"原音"按钮
                let hasSourceAudio = $(div).find('img[title*="原音"],img[title*="参考"],img[title*="source"],img[title*="参考音"]').length > 0;

                let click_record = (e) => {
                    console.log('click:', e);
                    $(e).find('img[title="录音"],img[title="停止"]').click();
                }

                if (hasSourceAudio) {
                    console.log('检测到有评分录音题型（有原音按钮）');
                    // 有评分录音题型 - 替代录音填空按钮
                    if ($('#auto_lytk').prop('checked')) {
                        setTimeout(() => { click_record(div); }, sum_record * 7000);
                        setTimeout(() => { click_record(div); }, 5000 + sum_record * 7000);
                        sum_record++;
                    }
                } else {
                    console.log('检测到无评分录音题型（无原音按钮）');
                    // 无评分录音题型 - 替代录音按钮
                    if ($('#auto_luyin').prop('checked')) {
                        setTimeout(() => { click_record(div); }, sum_record * 7000);
                        setTimeout(() => { click_record(div); }, 5000 + sum_record * 7000);
                        sum_record++;
                    }
                }
            });
            await sleep(2000 + sum_record * 7000)
        }

        // 单选题
        async function doSingleChoose() {
            let answer_map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5 }

            // 随机选择以获得正确答案
            $('.lib-single-item-img img').click()

            await sleep(inputDelay);
            click_btn(); // Submit
            await sleep(submitDelay);

            let answer = []
            $('.lib-single-cs-answer').each((i, item) => {
                answer.push(item.innerText)
            });

            click_btn(); // Retry
            await sleep(submitDelay);

            $('.lib-single-box').each((i, item) => {
                $($(item).find('.lib-single-item')[answer_map[answer[i]]]).find('img').click()
            });

            await sleep(inputDelay);
        }



        // 角色扮演
        async function doRolePlay() {
            $('.lib-role-select-item img')[0].click()
            $('.lib-role-select-start button').click()

            await sleep(120000);
        }

        // 文本填空
        async function doListenImgAnswer() {
            // 第一次尝试：使用随机短语填充并提交以获取正确答案
            let inputs = $('.lib-textarea-container, .img-blank-answer');
            $.each(inputs, function (i, item) {
                input_in(item, getRanPhrase());
            });

            await sleep(inputDelay);
            click_btn(); // Submit
            await sleep(submitDelay);

            // 获取正确答案 - 只使用包含"Suggested answer"文本的识别方法
            let correctAnswers = [];
            $('span').each((i, spanElement) => {
                if ($(spanElement).text().includes('Suggested answer')) {
                    // 正确答案在包含"Suggested answer"的span元素后面的div中
                    const answerText = $(spanElement).next('div').text().trim();
                    if (answerText) {
                        correctAnswers.push(answerText);
                        console.log(`[+] 找到第 ${i+1} 题正确答案: ${answerText}`);
                    }
                }
            });

            // 如果获取到正确答案，点击Retry并填入正确答案
            if (correctAnswers.length > 0) {
                click_btn(); // Retry
                await sleep(submitDelay);

                // 重新获取输入框（页面可能刷新）
                inputs = $('.lib-textarea-container, .img-blank-answer');

                // 填入正确答案
                $.each(inputs, function (i, item) {
                    if (correctAnswers[i]) {
                        input_in(item, correctAnswers[i]);
                        console.log(`[+] 填入第 ${i+1} 题正确答案: ${correctAnswers[i]}`);
                    } else {
                        // 如果没有对应的正确答案，使用随机短语
                        input_in(item, getRanPhrase());
                    }
                });

                await sleep(inputDelay);
                console.log('[+] 正确答案已填入，准备最终提交');
            } else {
                console.log('[!] 未找到正确答案，保持随机答案');
            }
        }

        // 拖块 - 改进版本
        async function doDrag() {
            console.log('[+] 开始处理拖块题型');

            // 获取所有拖块和答案框
            let answerbox = $('.lib-drag-answer-list');
            let boxes = $('.lib-drag-box');

            console.log(`[+] 找到 ${answerbox.length} 个答案框和 ${boxes.length} 个拖块`);

            // 第一次尝试：拖动所有拖块并提交获取正确答案
            for (let i = 0; i < answerbox.length; i++) {
                console.log(`[+] 第一次尝试拖动第 ${i+1} 个拖块`);
                await dragTo(boxes[i], answerbox[i]);
            };

            await sleep(inputDelay);
            click_btn(); // Submit
            await sleep(submitDelay);

            // 获取正确答案
            let answer = [];
            $('.lib-drag-stu-info-answer').each((i, item) => {
                let temp = [];
                $(item).find('span').each((j, answerSpan) => {
                    temp.push(answerSpan.innerText.trim())
                });
                answer.push(temp);
                console.log(`[+] 答案框 ${i+1} 的正确答案:`, temp);
            });

            // 重试
            click_btn(); // Retry
            await sleep(submitDelay);

            // 第二次尝试：根据正确答案精确拖动
            let flag = new Array(boxes.length).fill(false); // 标记已拖动的拖块
            let successCount = 0;
            let maxRetries = 3;

            for (let retry = 0; retry < maxRetries && successCount < answerbox.length; retry++) {
                console.log(`[+] 第 ${retry + 1} 次精确拖动尝试`);

                // 重新获取元素（页面可能刷新）
                answerbox = $('.lib-drag-answer-list');
                boxes = $('.lib-drag-box');

                for (let i = 0; i < answerbox.length; i++) {
                    if (answer[i] && answer[i].length > 0) {
                        let dict = {}; // 避免重复拖动相同文本到同一个答案框

                        for (let j = 0; j < boxes.length; j++) {
                            if (flag[j]) continue;

                            const text = $(boxes[j]).find('span').text().trim();
                            if (dict[text]) continue;

                            if (answer[i].includes(text)) {
                                console.log(`[+] 拖动 "${text}" 到答案框 ${i+1}`);
                                dict[text] = true;
                                flag[j] = true;

                                // 特殊处理最后一个拖块：确保目标方框可见
                                if (i === answerbox.length - 1) {
                                    console.log('[+] 检测到最后一个拖块，确保目标方框完全可见');
                                    await ensureLastBoxVisible(answerbox[i]);
                                }

                                // 改进的拖动：检查拖动是否成功
                                const success = await dragToWithCheck(boxes[j], answerbox[i]);
                                if (success) {
                                    successCount++;
                                    console.log(`[✓] 第 ${i+1} 个答案框拖动成功`);
                                } else {
                                    console.log(`[!] 第 ${i+1} 个答案框拖动失败，将重试`);
                                    flag[j] = false; // 标记为未拖动以便重试
                                }

                                await sleep(500); // 拖动间隔
                                break;
                            }
                        }
                    }
                }

                // 检查是否所有拖块都已正确放置
                if (await checkAllDragsCompleted()) {
                    console.log('[✓] 所有拖块都已正确放置');
                    break;
                }

                await sleep(1000); // 重试间隔
            }

            // 最终检查
            let allCompleted = await checkAllDragsCompleted();
            if (allCompleted) {
                console.log('[✓] 拖块处理完成');
            } else {
                console.log('[!] 拖块处理未完成，可能有部分拖块未正确放置');

                // 如果未完成，尝试手动调整位置
                console.log('[+] 尝试手动调整拖块位置');
                await adjustDragPositions();

                // 再次检查
                allCompleted = await checkAllDragsCompleted();
                if (allCompleted) {
                    console.log('[✓] 手动调整后拖块处理完成');
                } else {
                    console.log('[!] 手动调整后仍有拖块未完成');
                }
            }

            // 只有所有拖块都正确放置时才提交
            if (allCompleted) {
                console.log('[+] 所有拖块已正确放置，准备提交');
                await sleep(inputDelay);
            } else {
                console.log('[!] 由于拖块未全部完成，跳过提交');
            }
        }

        // 改进的拖动函数：带有成功检查
        async function dragToWithCheck(from, to) {
            try {
                // 保存原始位置用于验证
                const originalRect = from.getBoundingClientRect();

                // 执行拖动
                await dragTo(from, to);

                // 等待页面更新
                await sleep(300);

                // 检查拖动是否成功：元素应该移动到目标区域
                const newRect = from.getBoundingClientRect();
                const targetRect = to.getBoundingClientRect();

                // 验证：拖块应该在目标区域内或附近
                const isInTargetArea = (
                    newRect.left >= targetRect.left - 20 &&
                    newRect.right <= targetRect.right + 20 &&
                    newRect.top >= targetRect.top - 20 &&
                    newRect.bottom <= targetRect.bottom + 20
                );

                // 验证：拖块应该移动了位置
                const hasMoved = (
                    Math.abs(newRect.left - originalRect.left) > 10 ||
                    Math.abs(newRect.top - originalRect.top) > 10
                );

                return isInTargetArea && hasMoved;
            } catch (error) {
                console.error('[!] 拖动检查出错:', error);
                return false;
            }
        }

        // 检查所有拖块是否都已正确放置
        async function checkAllDragsCompleted() {
            try {
                const answerbox = $('.lib-drag-answer-list');
                const boxes = $('.lib-drag-box');

                // 检查每个答案框是否有拖块
                let completedCount = 0;
                let misplacedBoxes = [];

                answerbox.each((i, box) => {
                    const boxRect = box.getBoundingClientRect();
                    let hasDragBlock = false;
                    let dragIndex = -1;

                    // 检查是否有拖块在这个答案框内
                    boxes.each((j, drag) => {
                        const dragRect = drag.getBoundingClientRect();

                        // 判断拖块是否在答案框内
                        const isInside = (
                            dragRect.left >= boxRect.left - 15 &&
                            dragRect.right <= boxRect.right + 15 &&
                            dragRect.top >= boxRect.top - 15 &&
                            dragRect.bottom <= boxRect.bottom + 15
                        );

                        if (isInside) {
                            hasDragBlock = true;
                            dragIndex = j;
                            return false; // 跳出内层循环
                        }
                    });

                    if (hasDragBlock) {
                        completedCount++;
                        console.log(`[✓] 答案框 ${i+1} 有拖块放置`);
                    } else {
                        misplacedBoxes.push(i);
                        console.log(`[!] 答案框 ${i+1} 缺少拖块`);
                    }
                });

                console.log(`[+] 拖块放置状态: ${completedCount}/${answerbox.length} 完成`);

                // 检查是否有拖块悬空（不在任何答案框内）
                let floatingDrags = [];
                boxes.each((j, drag) => {
                    const dragRect = drag.getBoundingClientRect();
                    let isInAnyBox = false;

                    answerbox.each((i, box) => {
                        const boxRect = box.getBoundingClientRect();
                        const isInside = (
                            dragRect.left >= boxRect.left - 15 &&
                            dragRect.right <= boxRect.right + 15 &&
                            dragRect.top >= boxRect.top - 15 &&
                            dragRect.bottom <= boxRect.bottom + 15
                        );

                        if (isInside) {
                            isInAnyBox = true;
                            return false;
                        }
                    });

                    if (!isInAnyBox) {
                        floatingDrags.push(j);
                        console.log(`[!] 拖块 ${j+1} 悬空，未放入任何答案框`);
                    }
                });

                return completedCount === answerbox.length && floatingDrags.length === 0;
            } catch (error) {
                console.error('[!] 检查拖块完成状态出错:', error);
                return false;
            }
        }

        // 确保最后一个答案框完全可见
        async function ensureLastBoxVisible(lastBox) {
            try {
                console.log('[+] 确保最后一个答案框可见');

                const dragBlock = $(".lib-drag-block");
                if (dragBlock.length > 0) {
                    // 获取最后一个答案框的位置信息
                    const boxRect = lastBox.getBoundingClientRect();
                    const containerRect = dragBlock[0].getBoundingClientRect();

                    // 检查最后一个答案框是否完全可见
                    const isFullyVisible = (
                        boxRect.top >= containerRect.top &&
                        boxRect.bottom <= containerRect.bottom
                    );

                    if (!isFullyVisible) {
                        console.log('[+] 最后一个答案框不可见，调整滚动位置');

                        // 计算需要滚动的距离
                        const targetScrollTop = lastBox.offsetTop - (containerRect.height / 2) + (boxRect.height / 2);

                        // 平滑滚动到目标位置
                        dragBlock.animate({
                            scrollTop: targetScrollTop
                        }, 500);

                        await sleep(600); // 等待滚动完成

                        // 再次检查是否可见
                        const newBoxRect = lastBox.getBoundingClientRect();
                        const newContainerRect = dragBlock[0].getBoundingClientRect();

                        if (newBoxRect.top < newContainerRect.top || newBoxRect.bottom > newContainerRect.bottom) {
                            console.log('[+] 仍然不可见，强制滚动到底部');
                            dragBlock.scrollTop(dragBlock[0].scrollHeight);
                            await sleep(300);
                        }
                    } else {
                        console.log('[+] 最后一个答案框已经可见');
                    }
                }

                // 额外确保文档也滚动到合适位置
                $(document).scrollTop($(lastBox).offset().top - 200);
                await sleep(300);

            } catch (error) {
                console.error('[!] 确保最后一个答案框可见时出错:', error);
            }
        }

        // 手动调整拖块位置
        async function adjustDragPositions() {
            try {
                console.log('[+] 开始手动调整拖块位置');

                const answerbox = $('.lib-drag-answer-list');
                const boxes = $('.lib-drag-box');

                // 首先检查所有答案框，找到缺少拖块的
                let emptyBoxes = [];
                answerbox.each((i, box) => {
                    const boxRect = box.getBoundingClientRect();
                    let hasDrag = false;

                    boxes.each((j, drag) => {
                        const dragRect = drag.getBoundingClientRect();
                        const isInside = (
                            dragRect.left >= boxRect.left - 15 &&
                            dragRect.right <= boxRect.right + 15 &&
                            dragRect.top >= boxRect.top - 15 &&
                            dragRect.bottom <= boxRect.bottom + 15
                        );

                        if (isInside) {
                            hasDrag = true;
                            return false;
                        }
                    });

                    if (!hasDrag) {
                        emptyBoxes.push(i);
                    }
                });

                // 检查悬空的拖块
                let floatingDrags = [];
                boxes.each((j, drag) => {
                    const dragRect = drag.getBoundingClientRect();
                    let isInBox = false;

                    answerbox.each((i, box) => {
                        const boxRect = box.getBoundingClientRect();
                        const isInside = (
                            dragRect.left >= boxRect.left - 15 &&
                            dragRect.right <= boxRect.right + 15 &&
                            dragRect.top >= boxRect.top - 15 &&
                            dragRect.bottom <= boxRect.bottom + 15
                        );

                        if (isInside) {
                            isInBox = true;
                            return false;
                        }
                    });

                    if (!isInBox) {
                        floatingDrags.push(j);
                    }
                });

                console.log(`[+] 需要调整: ${emptyBoxes.length} 个空答案框, ${floatingDrags.length} 个悬空拖块`);

                // 如果有悬空拖块和空答案框，尝试重新放置
                if (floatingDrags.length > 0 && emptyBoxes.length > 0) {
                    for (let i = 0; i < Math.min(floatingDrags.length, emptyBoxes.length); i++) {
                        const dragIndex = floatingDrags[i];
                        const boxIndex = emptyBoxes[i];

                        console.log(`[+] 调整拖块 ${dragIndex+1} 到答案框 ${boxIndex+1}`);
                        await dragToWithCheck(boxes[dragIndex], answerbox[boxIndex]);
                        await sleep(500);
                    }
                }

                console.log('[+] 手动调整完成');
            } catch (error) {
                console.error('[!] 手动调整出错:', error);
            }
        }

        // 视频
        async function doVideo() {
            console.log('[+] 开始处理视频题');

            // 等待视频播放器加载
            await sleep(3000);

            // 尝试多种方式获取视频播放器
            let player = null;

            // 1. 尝试通过全局对象获取
            if (typeof unsafeWindow !== 'undefined') {
                player = unsafeWindow['yunPlayer'] || unsafeWindow.player;
                if (player) console.log('[+] 通过全局对象找到播放器');
            }

            // 2. 尝试通过getPlayer方法获取
            if (!player && typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.getPlayer === 'function') {
                try {
                    player = unsafeWindow.getPlayer();
                    if (player) console.log('[+] 通过getPlayer方法找到播放器');
                } catch (e) {
                    console.error('[!] 调用getPlayer方法出错:', e);
                }
            }

            // 3. 尝试通过DOM选择器获取
            if (!player) {
                const videoSelectors = [
                    '#J_prismPlayer',
                    'video',
                    '.prism-player',
                    '.video-js',
                    '[data-player]',
                    '.lib-video-player',
                    '.video-player'
                ];

                for (const selector of videoSelectors) {
                    player = document.querySelector(selector);
                    if (player) {
                        console.log(`[+] 使用DOM选择器找到播放器: ${selector}`);
                        break;
                    }
                }
            }

            if (!player) {
                console.error('[!] 视频播放器未找到，无法处理视频题');
                console.log('[!] 当前页面视频相关元素:', {
                    videos: document.querySelectorAll('video').length,
                    prismPlayers: document.querySelectorAll('#J_prismPlayer').length,
                    yunPlayer: typeof unsafeWindow !== 'undefined' ? !!unsafeWindow['yunPlayer'] : false,
                    getPlayer: typeof unsafeWindow !== 'undefined' ? typeof unsafeWindow.getPlayer : 'undefined'
                });
                return;
            }

            try {
                console.log('[+] 视频播放器信息:', {
                    tagName: player.tagName,
                    src: player.src || player.currentSrc,
                    duration: typeof player.getDuration === 'function' ? player.getDuration() : 'N/A',
                    currentTime: player.currentTime || 0
                });

                // 播放视频（如果支持）
                if (typeof player.play === 'function') {
                    await player.play();
                    console.log('[+] 视频开始播放');
                    await sleep(2000);
                }

                // 跳转到视频末尾（如果支持seek方法）
                if (typeof player.seek === 'function' && typeof player.getDuration === 'function') {
                    const duration = player.getDuration();
                    if (duration && duration > 10) {
                        player.seek(duration - 5);
                        console.log(`[+] 跳转到视频末尾: ${duration - 5}s`);
                        await sleep(3000); // 等待跳转完成
                    }
                } else if (typeof player.fastSeek === 'function') {
                    // 尝试其他seek方法
                    player.fastSeek(player.duration - 5);
                    await sleep(3000);
                }

                console.log('[+] 视频题处理完成');

            } catch (error) {
                console.error('[!] 视频播放出错:', error);
                // 即使出错也继续，不要阻塞
            }

            // 视频题需要额外等待时间
            await sleep(user_config.delay || 10000);
        }

        // 多选
        async function doMutiChoose() {
            let answer_map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9 }

            // 随机选择以获得正确答案
            $('.lib-single-item-img img').click()

            await sleep(inputDelay);
            click_btn(); // Submit
            await sleep(submitDelay);

            let answer = []
            $('.lib-single-cs-answer').each((i, item) => {
                answer.push(item.innerText)
            });

            click_btn(); // Retry
            await sleep(submitDelay);

            $('.lib-single-box').each((i, item) => {
                for (const answer_single of answer[i])
                    $($(item).find('.lib-single-item')[answer_map[answer_single]]).find('img').click()
            });

            await sleep(inputDelay);
        }

        // 调试函数：分析正确答案显示结构
        function debugAnswerStructure() {
            console.log('[DEBUG] 开始分析正确答案显示结构');

            // 根据explain文件，正确答案在 lib-judge-info-text 元素中
            const answerElements = $('.lib-judge-info-text');
            console.log(`[DEBUG] 找到 ${answerElements.length} 个正确答案元素:`);

            answerElements.each((i, elem) => {
                const $elem = $(elem);
                const answerText = $elem.text().trim();
                console.log(`[DEBUG] 正确答案元素 ${i + 1}: "${answerText}"`);

                // 查找对应的题号
                const questionNo = $elem.closest('.lib-judge-left-item-no-flex').find('.lib-drag-no').text().trim();
                console.log(`[DEBUG] 对应题号: ${questionNo}`);

                // 查找整个判断题容器
                const judgeContainer = $elem.closest('.lib-judge-left-item-no-flex');
                console.log(`[DEBUG] 容器类名: "${judgeContainer.attr('class') || '无'}"`);
            });

            // 查找所有判断题容器
            const judgeContainers = $('.lib-judge-left-item-no-flex');
            console.log(`[DEBUG] 找到 ${judgeContainers.length} 个判断题容器:`);

            judgeContainers.each((i, container) => {
                const $container = $(container);
                const questionNo = $container.find('.lib-drag-no').text().trim();
                const answerText = $container.find('.lib-judge-info-text').text().trim();

                console.log(`[DEBUG] 判断题 ${questionNo}:`);
                console.log(`  - 题号: ${questionNo}`);
                console.log(`  - 正确答案: "${answerText}"`);
                console.log(`  - 容器类名: "${$container.attr('class') || '无'}"`);
            });
        }

        // 判断题 - 多个判断题处理
        async function doJudge() {
            console.log('[+] 开始处理多个判断题');

            // 首先运行调试分析
            debugAnswerStructure();

            // 查找所有判断题选项（单选按钮）
            // 尝试多种选择器来找到判断题选项
        let judgeOptions = $('input[type="radio"], .lib-judge-radio, .judge-option, [data-type="judge"]');

        // 如果找不到选项，尝试查找包含选项文本的元素
        if (judgeOptions.length === 0) {
            judgeOptions = $('*').filter(function() {
                const text = $(this).text().trim().toLowerCase();
                return text === '正确' || text === '错误' || text === 'true' || text === 'false' || text === 't' || text === 'f';
            });
        }

            if (judgeOptions.length === 0) {
                console.log('[!] 未找到单选按钮，尝试查找判断题特定元素');
                judgeOptions = $('.lib-judge-radio, .judge-option, [data-type="judge"]');
            }

            console.log(`[+] 找到 ${judgeOptions.length} 个判断题选项`);

            if (judgeOptions.length === 0) {
                console.log('[!] 未找到任何判断题选项，无法处理');
                return;
            }

            // 第一次尝试：随机选择所有选项并提交以获取正确答案
            judgeOptions.each((i, option) => {
                if (option.tagName === 'INPUT') {
                    $(option).prop('checked', true).trigger('change');
                } else {
                    $(option).click();
                }
                console.log(`[+] 选项 ${i + 1} 选择完成`);
            });

            await sleep(inputDelay);
            click_btn(); // Submit
            await sleep(submitDelay);

            // 获取正确答案 - 基于explain文件的精确结构
            let correctAnswers = {};

            // 根据explain文件，正确答案在 lib-judge-info-text 元素中，题号在 lib-drag-no 元素中
            const judgeContainers = $('.lib-judge-left-item-no-flex');
            console.log(`[+] 找到 ${judgeContainers.length} 个判断题容器`);

            judgeContainers.each((i, container) => {
                const $container = $(container);

                // 获取题号
                const questionNo = $container.find('.lib-drag-no').text().trim();

                // 获取正确答案（直接是 "T" 或 "F"）
                const answerText = $container.find('.lib-judge-info-text').text().trim();

                console.log(`[+] 判断题 ${questionNo}: 正确答案文本 = "${answerText}"`);

                // 解析正确答案（根据explain文件，直接是 "T" 或 "F"）
                let correctAnswer = '正确'; // 默认正确

                if (answerText === 'T') {
                    correctAnswer = '正确';
                    console.log(`[+] 判断题 ${questionNo} 正确答案: 正确 (T)`);
                } else if (answerText === 'F') {
                    correctAnswer = '错误';
                    console.log(`[+] 判断题 ${questionNo} 正确答案: 错误 (F)`);
                } else {
                    console.log(`[!] 判断题 ${questionNo} 无法识别的答案: "${answerText}"`);
                }

                // 存储正确答案，使用题号作为键
                correctAnswers[questionNo] = correctAnswer;
            });

            console.log(`[+] 解析出的正确答案映射: ${JSON.stringify(correctAnswers)}`);

            // 重试
            click_btn(); // Retry
            await sleep(submitDelay);

            // 第二次尝试：精确选择所有正确答案
            if (Object.keys(correctAnswers).length > 0) {
                console.log('[+] 开始精确选择正确答案');

                // 重新获取选项（重试后选项状态可能重置）
                judgeOptions = $('input[type="radio"], .lib-judge-radio, .judge-option, [data-type="judge"]');

                // 如果找不到选项，尝试查找包含选项文本的元素
                if (judgeOptions.length === 0) {
                    judgeOptions = $('*').filter(function() {
                        const text = $(this).text().trim().toLowerCase();
                        return text === '正确' || text === '错误' || text === 'true' || text === 'false' || text === 't' || text === 'f';
                    });
                }

                if (judgeOptions.length === 0) {
                    judgeOptions = $('.lib-judge-radio, .judge-option, [data-type="judge"]');
                }

                console.log(`[+] 重试后找到 ${judgeOptions.length} 个选项`);

                // 按判断题处理（假设每2个选项为一组：正确/错误）
                for (let i = 0; i < judgeOptions.length; i += 2) {
                    const questionIndex = Math.floor(i / 2) + 1; // 题号从1开始
                    const correctAnswer = correctAnswers[questionIndex] || correctAnswers[i] || '正确'; // 优先使用对应题号的答案

                    console.log(`[+] 处理判断题 ${questionIndex}, 正确答案: ${correctAnswer}`);

                    let foundCorrect = false;

                    // 检查当前组的两个选项
                    for (let j = i; j < Math.min(i + 2, judgeOptions.length); j++) {
                        const option = judgeOptions[j];
                        const optionText = $(option).text().trim().toLowerCase();
                        const optionValue = $(option).val() || '';
                        const optionLabel = $(option).next('label').text().trim().toLowerCase() || '';

                        // 尝试找到选项对应的题号信息
                        let optionQuestionIndex = questionIndex;
                        const optionContainer = $(option).closest('.lib-judge-left-item-no-flex');
                        if (optionContainer.length > 0) {
                            const questionNo = optionContainer.find('.lib-drag-no').text().trim();
                            optionQuestionIndex = parseInt(questionNo) || questionIndex;
                        }

                        console.log(`[+] 选项 ${j + 1} (题号${optionQuestionIndex}): text="${optionText}", value="${optionValue}", label="${optionLabel}"`);

                        // 只有当选项的题号匹配当前判断题时才进行选择
                        if (optionQuestionIndex === questionIndex) {
                            const isCorrectOption = (
                                (correctAnswer === '正确' && (
                                    optionText.includes('正确') || optionText.includes('true') || optionText.includes('对') || optionText.includes('是') ||
                                    optionValue.includes('正确') || optionValue.includes('true') || optionValue.includes('对') || optionValue.includes('是') ||
                                    optionLabel.includes('正确') || optionLabel.includes('true') || optionLabel.includes('对') || optionLabel.includes('是') ||
                                    optionText === 't' || optionValue === 't' || optionLabel === 't'
                                )) ||
                                (correctAnswer === '错误' && (
                                    optionText.includes('错误') || optionText.includes('false') || optionText.includes('错') || optionText.includes('否') ||
                                    optionValue.includes('错误') || optionValue.includes('false') || optionValue.includes('错') || optionValue.includes('否') ||
                                    optionLabel.includes('错误') || optionLabel.includes('false') || optionLabel.includes('错') || optionLabel.includes('否') ||
                                    optionText === 'f' || optionValue === 'f' || optionLabel === 'f'
                                ))
                            );

                            if (isCorrectOption) {
                                if (option.tagName === 'INPUT') {
                                    $(option).prop('checked', true).trigger('change');
                                } else {
                                    $(option).click();
                                }
                                foundCorrect = true;
                                console.log(`[✓] 判断题 ${questionIndex} 选择了正确答案: ${correctAnswer}`);
                                break;
                            }
                        }
                    }

                    if (!foundCorrect) {
                        console.log(`[!] 判断题 ${questionIndex} 未找到精确匹配选项，尝试基于位置选择`);

                        // 基于位置选择：如果正确答案是"正确"，选择当前组的第一个选项；如果是"错误"，选择第二个选项
                        // 根据explain文件，选项顺序通常是：第一个是"正确"，第二个是"错误"
                        const positionToSelect = correctAnswer === '正确' ? i : i + 1;

                        if (positionToSelect < judgeOptions.length) {
                            const option = judgeOptions[positionToSelect];
                            if (option.tagName === 'INPUT') {
                                $(option).prop('checked', true).trigger('change');
                            } else {
                                $(option).click();
                            }
                            foundCorrect = true;
                            console.log(`[✓] 判断题 ${questionIndex} 基于位置选择了: ${correctAnswer} (位置 ${positionToSelect + 1})`);
                        } else {
                            console.log(`[!] 判断题 ${questionIndex} 位置超出范围，使用第一个选项`);
                            if (judgeOptions[i].tagName === 'INPUT') {
                                $(judgeOptions[i]).prop('checked', true).trigger('change');
                            } else {
                                $(judgeOptions[i]).click();
                            }
                        }
                    }

                    await sleep(100); // 每个判断题之间短暂延迟
                }

                console.log('[+] 所有正确答案选择完成，准备提交');
            } else {
                console.log('[!] 无法确定正确答案，随机选择');
                // 随机选择所有选项
                judgeOptions.each((i, option) => {
                    if (option.tagName === 'INPUT') {
                        $(option).prop('checked', true).trigger('change');
                    } else {
                        $(option).click();
                    }
                });
            }

            await sleep(inputDelay);
            console.log('[+] 多个判断题处理完成，准备提交正确答案');
            click_btn(); // Submit 正确答案
            return true; // 返回true表示已经处理完成
        }

        // 不支持体型
        async function unSupposedOrSkip(params) {
            console.log('[!]', '遇到不支持题型或未选择，自动跳过。。。');
            await sleep(user_config.delay); // 每题耗时
        }
        // EXTERNAL MODULE: ./src/assets/element-ui.css.txt
        // Element UI CSS 已通过外部CDN引入
// var element_ui_css = __webpack_require__(379); // 原内嵌CSS模块
        // EXTERNAL MODULE: ./src/assets/yun.css.txt
        var yun_css = __webpack_require__(987);
        ;// CONCATENATED MODULE: ./src/wk_v2.js




        async function doTopic() {
            let setTixing = async (t) => {
                console.log('[+] 题型:', t);
                $('#yun_status').text('当前题型：' + t);
            };

            if ($('.wy-course-bottom .wy-course-btn-right .wy-btn').text().indexOf('Submit') == -1 && $('#J_prismPlayer').length == 0) {
                // $('.page-next')[1].click();
                // await sleep(pageNextDelay);
                $('#yun_status').text('当前题目已完成');
                return false;
            }

            if ($('img[title="录音"]').length != 0) {
                // 检测是否有原音按钮
                const hasSourceAudio = $('img[src*="source"], img[src*="参考"], img[src*="原音"], img[title*="source"], img[title*="参考"], img[title*="原音"]').length > 0;

                if (hasSourceAudio && user_config.autodo.includes('auto_lytk')) {
                    await setTixing('有评分录音');
                    await doReadRepeat();
                } else if (!hasSourceAudio && user_config.autodo.includes('auto_luyin')) {
                    await setTixing('无评分录音');
                    await doReadRepeat();
                }
            } else if ($('.lib-textarea-container, .img-blank-answer').length != 0 && user_config.autodo.includes('auto_lytk')) {
                await setTixing('文本填空');
                await doListenImgAnswer();
            } else if ($('.lib-fill-blank-do-input-left').length != 0 && user_config.autodo.includes('auto_tiankong')) {
                await setTixing('填空');
                await doTianKone();
            } else if ($('.lib-single-item-img img[src="assets/exercise/no-choices.png"]').length != 0 && user_config.autodo.includes('auto_duoxuan')) {
                await setTixing('多选');
                await doMutiChoose();
            } else if ($('.lib-single-item-img').length != 0 && user_config.autodo.includes('auto_danxuan')) {
                await setTixing('单选');
                await doSingleChoose();
            } else if ($('.lib-role-select-item').length != 0 && user_config.autodo.includes('auto_lytk')) {
                await setTixing('有评分录音');
                await doRolePlay();
            } else if ($('.lib-judge-radio.lib-cursor.ng-star-inserted').length != 0 && user_config.autodo.includes('auto_judge')) {
                await setTixing('判断题');
                await doJudge();
                return true; // 判断题已经完成提交，不需要再次提交
            } else if (($('.lib-textarea-container, .img-blank-answer').length != 0) && user_config.autodo.includes('auto_dropchoose')) {
                await setTixing('文本填空');
                await doListenImgAnswer();
            } else if ($('.lib-drag-box').length != 0 && user_config.autodo.includes('auto_drag')) {
                await setTixing('拖块');
                await doDrag();
            } else if ($('#J_prismPlayer').length != 0 && user_config.autodo.includes('auto_video')) {
                await setTixing('视频');
                await doVideo();
                // doVideo()函数内部已经包含了等待时间，不需要额外等待
                return true;
            } else {
                await unSupposedOrSkip();
                return false;
            }

            // 在最后一次提交前等待用户设置的时长
            console.log(`[+] 等待用户设置的时长: ${user_config.delay}ms`);
            await sleep(user_config.delay);
            click_btn(); // Submit
            return true;
        }

        // ===========================================

        let running = false;

        async function initConf() {
            user_config = await GM.getValue('config', user_config);

            $.each(user_config.autodo, (index, id) => {
                $('#' + id).prop("checked", true);
            });
            $('#set_tryerr').prop("checked", user_config.autotryerr);
            $('#set_manu').prop("checked", user_config.autostop);
            $('#set_delay').val(user_config.delay / 1000);
        }



        try {
            extendConsole(window.console, true);
            console.capsule && console.capsule('视听说', 'v4+');
        } catch (e) {
            console.warn('[Yun] extendConsole failed:', e);
        }

        // 将doLoop函数移到全局作用域
        window.doLoop = async function() {
            let loopCount = 0;
            const maxLoopCount = 100; // 最大循环次数防止无限循环

            while (running && loopCount < maxLoopCount) {
                loopCount++;
                console.log('[*]', `开始处理第 ${loopCount} 题`);

                try {
                    // 检查是否已经到达最后一题
                    if ($('.page-next').length === 0 || $('.page-next:contains("下一单元")').length > 0) {
                        $('#yun_status').text('已完成所有题目！');
                        console.log('[*]', '已完成所有题目');
                        break;
                    }

                    let status = await doTopic();
                    if (!status && user_config.autostop) {
                        $('#yun_status').text('不支持当前题型, 已停止');
                        break;
                    }

                    console.log('[*]', '已完成，切换下一题。。。');
                    await sleep(submitDelay);

                    // 确保下一页按钮存在且可用
                    const nextButtons = $('.page-next:not(:disabled)');
                    if (nextButtons.length > 1) {
                        nextButtons[1].click();
                    } else if (nextButtons.length > 0) {
                        nextButtons[0].click();
                    } else {
                        console.error('[!] 未找到可用的下一页按钮');
                        $('#yun_status').text('未找到下一页按钮');
                        break;
                    }

                    // 等待页面完全加载后再继续处理下一题
                    console.log('[*]', '等待页面加载完成...');
                    $('#yun_status').text('等待页面加载...');

                    // 添加智能页面加载检测
                    let pageLoaded = false;
                    let waitCount = 0;
                    const maxWaitCount = 60; // 12秒 (60 * 200ms)

                    while (waitCount < maxWaitCount && running) {
                        await sleep(200);
                        waitCount++;

                        // 多种方式检测页面是否已加载完成
                        const pageIndicators = [
                            '.lib-single-item-img', // 单选题图片
                            '.lib-fill-blank-do-input-left', // 填空题输入框
                            '.lib-textarea-container', // 文本区域
                            '.wy-course-btn-right .wy-btn', // 提交按钮
                            '.lib-judge-radio', // 判断题
                            '.lib-drag-box', // 拖拽题
                            '#J_prismPlayer' // 视频播放器
                        ];

                        for (const selector of pageIndicators) {
                            if ($(selector).length > 0) {
                                pageLoaded = true;
                                break;
                            }
                        }

                        if (pageLoaded) break;

                        // 每2秒更新一次状态
                        if (waitCount % 10 === 0) {
                            $('#yun_status').text(`等待页面加载... ${waitCount/5}s`);
                        }
                    }

                    if (!pageLoaded && running) {
                        console.warn('[!] 页面加载超时，尝试刷新或继续');
                        $('#yun_status').text('页面加载超时，尝试继续...');

                        // 尝试刷新页面
                        try {
                            if ($('.page-refresh').length > 0) {
                                $('.page-refresh')[0].click();
                                await sleep(3000);
                            }
                        } catch (refreshError) {
                            console.warn('[!] 刷新页面失败:', refreshError);
                        }
                    }

                    await sleep(1500); // 额外等待1.5秒确保页面完全稳定

                } catch (error) {
                    console.error('[!] 处理题目时出错:', error);
                    $('#yun_status').text('处理出错，2秒后继续...');

                    // 错误恢复机制：等待后继续
                    await sleep(2000);

                    // 尝试刷新页面恢复
                    try {
                        if ($('.page-refresh').length > 0) {
                            $('.page-refresh')[0].click();
                            await sleep(3000);
                        }
                    } catch (refreshError) {
                        console.warn('[!] 刷新页面失败:', refreshError);
                    }
                }
            }

            // 循环结束后的清理工作
            if (loopCount >= maxLoopCount) {
                $('#yun_status').text('已达到最大题目数量限制');
                console.warn('[!] 已达到最大循环次数限制');
            }

            $('.yunPanel button').prop('disabled', false);
            $('.yunPanel button').removeClass('is-disabled');
            $('#yun_status').text('状态栏');
            console.log('[*]', '自动答题已停止');
            running = false; // 确保running状态被正确重置
        };

        initHook();
        
        // 更可靠的页面加载检测
        if (document.readyState === 'complete') {
            // 页面已经加载完成，立即执行
            pageFullyLoaded();
        } else {
            // 页面还在加载，等待load事件
            window.addEventListener("load", pageFullyLoaded);
        }

        function pageFullyLoaded() {
    console.capsule('Yun', '注入窗口');
    
    GM.addStyle(yun_css);
            const modern_panel_css = `
.yunPanel {
    position: fixed;
    top: 100px;
    left: 100px; /* 初始位置，拖动时会更新 */
    width: 420px;
    padding: 24px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.95);
    color: #2D3748;
    backdrop-filter: blur(20px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"PingFang SC\", \"Helvetica Neue\", sans-serif;
    transition: box-shadow 0.3s ease;
}
.yunPanel:hover {
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08);
}
.yunPanel h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px;
    text-align: center;
    cursor: grab;
    user-select: none;
    color: #2D3748;
    letter-spacing: -0.5px;
}
.yunPanel h2 {
    font-size: 16px;
    font-weight: 600;
    color: #2D3748;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.yunPanel h2:before {
    content: '';
    width: 4px;
    height: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
}
.yunPanel hr {
    border: none;
    border-top: 1px solid rgba(226, 232, 240, 0.8);
    margin: 12px 0;
}
.yunPanel > p {
    margin: 8px 0;
    line-height: 1.5;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px 12px;
    align-items: center;
}

.yunPanel > p > .checkbox-group {
    margin: 0;
}
.yunPanel .checkbox-group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    transition: background 0.2s;
    border-radius: 8px;
}
.yunPanel .checkbox-group:hover {
    background: rgba(237, 242, 247, 0.5);
}
.yunPanel input[type=\"checkbox\"] {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #CBD5E0;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    accent-color: #667eea;
}
.yunPanel input[type=\"checkbox\"]:checked {
    background: #667eea;
    border-color: #667eea;
}
.yunPanel input[type=\"checkbox\"]:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.yunPanel label {
    font-size: 14px;
    color: #4A5568;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s;
}
.yunPanel label:hover {
    color: #2D3748;
}
.yunPanel input[type=\"text\"] {
    width: 80px;
    padding: 8px 12px;
    border: 2px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: all 0.2s;
}
.yunPanel input[type=\"text\"]:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.yunPanel button {
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
.yunPanel button:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.yunPanel #yun_save,
.yunPanel #yun_reset {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: auto;
    flex: 1;
    margin: 8px 4px;
}
.yunPanel #yun_save:hover,
.yunPanel #yun_reset:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
.yunPanel #yun_doone {
    background: #48BB78;
    color: white;
    flex: 1;
    margin: 8px 4px;
}
.yunPanel #yun_doone:hover {
    background: #38A169;
}
.yunPanel #yun_start {
    background: linear-gradient(135deg, #F56565 0%, #E53E3E 100%);
    color: white;
    flex: 1;
    margin: 8px 4px;
}
.yunPanel #yun_start:hover {
    background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
}
.yunPanel .close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    background: rgba(226, 232, 240, 0.8);
    transition: all 0.2s;
    color: #718096;
}
.yunPanel .close:hover {
    background: #E53E3E;
    color: white;
    transform: rotate(90deg);
}
.yunPanel .close:before {
    content: '×';
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
}
.yunPanel button.is-disabled,
.yunPanel button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}
.yunPanel #yun_status {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin: 16px 0;
    padding: 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%);
    border: 1px solid #E2E8F0;
    color: #4A5568;
}`;
            GM.addStyle(modern_panel_css);
            $(document.body).after(`
    <div class="yunPanel">
        <div class="close"></div>
        <h1 class="grabber">清华社 - 自动答题</h1>
        <hr>
        <h2>自动完成题型</h2>
        <p>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_tiankong">
                <label for="auto_tiankong">填空</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_luyin">
                <label for="auto_luyin">无评分录音</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_lytk">
                <label for="auto_lytk">有评分录音</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_judge">
                <label for="auto_judge">判断题</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_danxuan">
                <label for="auto_danxuan">单项选择</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_duoxuan">
                <label for="auto_duoxuan">多项选择</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_dropchoose">
                <label for="auto_dropchoose">文本填空</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_drag">
                <label for="auto_drag">拖块</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_video">
                <label for="auto_video">视频</label>
            </span>
        </p>
        <h2>设置选项</h2>
        <p>
            <span class="checkbox-group">
                <input type="checkbox" id="set_tryerr">
                <label for="set_tryerr">自动试错</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="set_manu">
                <label for="set_manu">未知题型停止</label>
            </span>
        </p>
        <p style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
            <span style="font-size: 14px; color: #4A5568; font-weight: 500;">每题耗时(秒)</span>
            <input type="text" id="set_delay" value="10" style="width: 100px;">
        </p>
        <p style="display: flex; gap: 8px; margin: 16px 0;">
            <button id="yun_save">💾 保存设置</button>
            <button id="yun_reset">🔄 恢复默认</button>
        </p>
        <hr>
        <h2 id="yun_status">状态栏</h2>
        <p style="display: flex; gap: 8px; margin: 16px 0;">
            <button id="yun_doone">🎯 只做一题</button>
            <button id="yun_start">🚀 开始答题</button>
        </p>
    </div>
    `);

            // 窗口拖动 - 实时拖动
            let draging = false, startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

            $(document).mousemove((e) => {
                if (draging) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    $('.yunPanel').css({
                        left: initialLeft + deltaX + 'px',
                        top: initialTop + deltaY + 'px',
                        right: 'auto',
                        transform: 'none'
                    });
                }
            });

            $('.grabber').mousedown((e) => {
                draging = true;
                startX = e.clientX;
                startY = e.clientY;
                const panel = $('.yunPanel');
                initialLeft = parseInt(panel.css('left')) || 0;
                initialTop = parseInt(panel.css('top')) || 0;
                e.preventDefault();
            });
            $(document).mouseup(() => { draging = false; });

            // 按钮事件
            $('#yun_start').click(async () => {
                if ($('#yun_start').text() == '开始答题') {
                    // 开始答题
                    $('#yun_doone').prop('disabled', true);
                    $('#yun_doone').addClass('is-disabled');
                    $('#yun_start').prop('disabled', false); // 确保开始按钮可用
                    running = true;
                    $('#yun_status').text('开始处理题目...');
                    $('#yun_start').text('停止答题'); // 立即更新按钮文本

                    try {
                        await doLoop();
                    } catch (error) {
                        console.error('[!] 答题循环异常:', error);
                        $('#yun_status').text('答题循环异常，已停止');
                    } finally {
                        // 无论成功失败都恢复按钮状态
                        $('.yunPanel button').prop('disabled', false);
                        $('.yunPanel button').removeClass('is-disabled');
                        $('#yun_start').text('开始答题');
                        running = false;
                    }

                } else {
                    // 停止答题 - 立即恢复按钮状态
                    running = false;
                    $('#yun_status').text('用户手动停止');

                    // 立即恢复所有按钮状态
                    $('.yunPanel button').prop('disabled', false);
                    $('.yunPanel button').removeClass('is-disabled');
                    $('#yun_start').text('开始答题');
                }
            });

            $('#yun_doone').click(() => {
                $('#yun_start').text('开始答题');
                running = false;
                $('.yunPanel button').prop('disabled', true);
                $('.yunPanel button').addClass('is-disabled');
                doTopic().then((result) => {
                    $('.yunPanel button').prop('disabled', false);
                    $('.yunPanel button').removeClass('is-disabled');
                    if (result) {
                        $('#yun_status').text('已完成!');
                    }
                });

            });
            $('.yunPanel .close').click(() => { $('.yunPanel').hide() });
            $('#yun_reset').click(() => { GM.deleteValue('config'); window.location.reload(); });
            $('#yun_save').click(() => {
                user_config.autodo = []
                $.each(allauto, (index, id) => {
                    if ($('#' + id).prop("checked")) {
                        user_config.autodo.push(id);
                    }
                });
                user_config.autotryerr = $('#set_tryerr').prop("checked");
                user_config.autostop = $('#set_manu').prop("checked");
                user_config.delay = $('#set_delay').val() * 1000;

                GM.setValue('config', user_config).then(() => {
                    $('#yun_status').text('保存成功');
                });
            });

            // 有评分录音复选框点击事件
            $('#auto_lytk').click(function() {
                if ($(this).prop('checked')) {
                    // 保存原始样式
                    const originalStyles = {
                        background: $('.yunPanel').css('background'),
                        color: $('.yunPanel').css('color'),
                        statusText: $('#yun_status').text()
                    };

                    // 设置红色警告样式
                    $('.yunPanel').css({
                        'background': 'rgba(255, 0, 0, 0.9)',
                        'color': 'white'
                    });
                    $('#yun_status').text('该题型请自行完成！');

                    // 禁用所有按钮和复选框
                    $('.yunPanel button, .yunPanel input').prop('disabled', true);

                    // 倒计时3秒后恢复
                    let countdown = 3;
                    const countdownInterval = setInterval(() => {
                        $('#yun_status').text('该题型请自行完成！ (' + countdown + ')');
                        countdown--;

                        if (countdown < 0) {
                            clearInterval(countdownInterval);
                            // 恢复原始样式
                            $('.yunPanel').css({
                                'background': originalStyles.background,
                                'color': originalStyles.color
                            });
                            $('#yun_status').text(originalStyles.statusText);
                            // 取消勾选有评分录音
                            $('#auto_lytk').prop('checked', false);
                            // 恢复所有按钮和复选框
                            $('.yunPanel button, .yunPanel input').prop('disabled', false);
                            // 重新启用判断题复选框的禁用状态
                            $('#auto_roleplay').prop('disabled', true);
                        }
                    }, 1000);
                }
            });

            initConf();
        }
    })();

    /******/
})();
} // executeWebpack函数结束