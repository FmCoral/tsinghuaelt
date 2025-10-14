// ==UserScript==
// @name         清华社英语在线-本地版
// @version      1.0.2
// @description  本版本将外部缓存文件仅设置成一个
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
// @resource     main_script file:///E:/桌面/tsinghuaelt/EachPart/main.js
// @resource     utils_script file:///E:/桌面/tsinghuaelt/EachPart/utils.js
// @resource     jquery https://code.jquery.com/jquery-3.5.1.min.js
// @connect      *
// @updateURL    https://github.com/FmCoral/tsinghuaelt
// @downloadURL  https://github.com/FmCoral/tsinghuaelt
// ==/UserScript==



// 定义typeColor函数，美化控制台输出
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

console.capsule = function (title, info, type = 'primary', ...args) {
    console.log(
        `%c ${title} %c ${info} %c`,
        'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
        `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
        'background:transparent', ...args
    );
};

// 直接从CDN加载jQuery
console.log('[coral] 开始加载 jQuery 库...');

const script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
script.onload = function () {
    console.capsule('coral ', 'jQuery加载成功');
    // 确保jQuery完全加载后再加载其他脚本到缓存
    if (typeof jQuery !== 'undefined') {
        loadScriptsToCache();
    } else {
        console.error('[coral] jQuery加载失败，无法继续执行');
    }
};

// 添加错误处理
script.onerror = function () {
    console.error('[coral] jQuery库加载失败');
};

document.head.appendChild(script);

console.log('🚀 脚本开始加载...');

// 状态栏管理功能
const StatusBar = {
    messages: [],
    maxMessages: 3,
    
    addMessage(message) {
        this.messages.push({text: message, timestamp: new Date().toLocaleTimeString()});
        if (this.messages.length > this.maxMessages) this.messages.shift();
        this.updateDisplay();
    },
    
    updateDisplay() {
        // 使用主窗口中的状态栏元素
        const el = document.getElementById('coral_status');
        if (!el) return;
        
        // 找到状态栏标题后面的容器（通常是下一个兄弟元素）
        let statusContainer = el.nextElementSibling;
        if (!statusContainer || !statusContainer.classList.contains('status-container')) {
            // 如果不存在状态容器，创建一个
            statusContainer = document.createElement('div');
            statusContainer.className = 'status-container';
            statusContainer.style.cssText = 'margin-top:10px;padding:10px;background:#f8f9fa;border-radius:8px;font-size:12px;line-height:1.4;max-height:120px;overflow-y:auto;';
            el.parentNode.insertBefore(statusContainer, el.nextSibling);
        }
        
        let html = '<div style="text-align:left;">';
        if (this.messages.length === 0) {
            html += '<div style="color:#666;font-style:italic;">等待状态更新...</div>';
        } else {
            this.messages.forEach((msg, i) => {
                const isLatest = i === this.messages.length - 1;
                html += `<div style="margin:4px 0;color:${isLatest ? '#2d8cf0' : '#666'};font-weight:${isLatest ? '600' : '400'};">
                    <span style="color:#999;font-size:10px;">[${msg.timestamp}]</span> ${msg.text}
                </div>`;
            });
        }
        statusContainer.innerHTML = html + '</div>';
    },
    
    clear() {
        this.messages = [];
        this.updateDisplay();
    }
};

// 状态栏输出函数
window.logToStatusBar = (...args) => {
    StatusBar.addMessage(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
};

// 初始化状态栏显示
function initStatusBar() {
    // 等待主窗口创建后再初始化状态栏
    const checkInterval = setInterval(() => {
        const coralStatus = document.getElementById('coral_status');
        if (coralStatus) {
            clearInterval(checkInterval);
            
            // 确保状态栏容器存在
            StatusBar.updateDisplay();
            
            console.log('✅ 状态栏已集成到主窗口');
            window.logToStatusBar('等待用户操作···');
            console.log('状态栏已初始化');
        }
    }, 100);
    
    // 10秒后停止检查，避免无限循环
    setTimeout(() => clearInterval(checkInterval), 10000);
}

// 页面加载后初始化状态栏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatusBar);
} else {
    initStatusBar();
}

/**
 * 加载脚本到缓存但不执行
 */
function loadScriptsToCache() {
    console.log('📥 开始加载脚本到缓存...');
    
    // 初始化缓存对象
    window.cachedScripts = window.cachedScripts || {};
    
    // 使用GM_getResourceText获取资源内容到缓存
    try {
        // 加载main.js到缓存
        const mainScript = GM_getResourceText('main_script');
        if (mainScript) {
            window.cachedScripts['main.js'] = mainScript;
            console.log('✅ main.js已加载到缓存，大小:', mainScript.length, '字符');
        }
        
        // 加载utils.js到缓存
        const utilsScript = GM_getResourceText('utils_script');
        if (utilsScript) {
            window.cachedScripts['utils.js'] = utilsScript;
            console.log('✅ utils.js已加载到缓存，大小:', utilsScript.length, '字符');
        }
        
        console.log('📊 缓存状态:', {
            'main.js': window.cachedScripts['main.js'] ? '✅ 已缓存' : '❌ 未缓存',
            'utils.js': window.cachedScripts['utils.js'] ? '✅ 已缓存' : '❌ 未缓存'
        });
        
        // 所有脚本加载完成后执行主逻辑
        executeWebpack();
        
    } catch (error) {
        console.error('❌ 脚本加载到缓存失败:', error);
        // 即使缓存失败也继续执行，但显示错误
        executeWebpack();
    }
}

function executeWebpack() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🚀 脚本开始初始化...');

        // 检查缓存状态 - 准确检测是否已加载到缓存
        const hasMainCached = window.cachedScripts && window.cachedScripts['main.js'] && window.cachedScripts['main.js'].length > 0;
        const hasUtilsCached = window.cachedScripts && window.cachedScripts['utils.js'] && window.cachedScripts['utils.js'].length > 0;

        if (!hasMainCached || !hasUtilsCached) {
            // 有文件未加载到缓存，显示错误弹窗
            showErrorPopup(hasMainCached, hasUtilsCached);
            return; // 停止执行
        }

        // 所有文件都已缓存，正常运行
        runScript();
    }

    /**
     * 显示错误弹窗
     */
    function showErrorPopup(hasMainCached, hasUtilsCached) {
        console.log('❌ 有文件未加载到缓存，显示错误弹窗');

        // 创建弹窗容器
        const popup = document.createElement('div');
        popup.id = 'tsinghuaelt-error-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        // 创建弹窗内容
        const popupContent = document.createElement('div');
        popupContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
        `;

        // 生成错误信息
        const failedFiles = [];
        if (!hasMainCached) failedFiles.push('main.js');
        if (!hasUtilsCached) failedFiles.push('utils.js');

        const errorMessage = failedFiles.length > 0
            ? `以下文件未加载到缓存：${failedFiles.join(', ')}`
            : '未知错误';

        popupContent.innerHTML = `
            <h2 style="color: #dc3545; margin: 0 0 20px 0; font-size: 24px;">
                ❌ 缓存加载失败
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">
                    📁 缓存状态检测
                </h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 8px 0; background: white; border-radius: 6px; border-left: 4px solid ${hasMainCached ? '#28a745' : '#dc3545'};">
                    <div style="text-align: left;">
                        <strong>main.js</strong><br>
                        <small style="color: #6c757d;">主逻辑文件</small>
                    </div>
                    <div style="color: ${hasMainCached ? '#28a745' : '#dc3545'}; font-weight: bold;">
                        ${hasMainCached ? '✅ 已缓存' : '❌ 未缓存'}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 8px 0; background: white; border-radius: 6px; border-left: 4px solid ${hasUtilsCached ? '#28a745' : '#dc3545'};">
                    <div style="text-align: left;">
                        <strong>utils.js</strong><br>
                        <small style="color: #6c757d;">工具函数库</small>
                    </div>
                    <div style="color: ${hasUtilsCached ? '#28a745' : '#dc3545'}; font-weight: bold;">
                        ${hasUtilsCached ? '✅ 已缓存' : '❌ 未缓存'}
                    </div>
                </div>
            </div>
            
            <div style="color: #6c757d; font-size: 14px; margin: 20px 0; line-height: 1.5;">
                <p><strong>问题原因：</strong>${errorMessage}</p>
                <p><strong>解决方案：</strong>请检查文件路径是否正确，确保所有依赖文件都存在。</p>
            </div>
            
            <div style="margin-top: 25px;">
                <button id="close-popup-btn" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 0 10px;
                ">关闭弹窗</button>
                
                <button id="reload-script-btn" style="
                    background: #007acc;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 0 10px;
                ">重新加载</button>
            </div>
        `;

        popup.appendChild(popupContent);
        document.body.appendChild(popup);

        // 添加按钮事件监听器
        const closeBtn = document.getElementById('close-popup-btn');
        const reloadBtn = document.getElementById('reload-script-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                const popup = document.getElementById('tsinghuaelt-error-popup');
                if (popup) {
                    popup.remove();
                }
            });
        }

        if (reloadBtn) {
            reloadBtn.addEventListener('click', function () {
                location.reload();
            });
        }

        console.log('✅ 错误弹窗已显示');
    }

    /**
     * 正常运行脚本
     */
    function runScript() {
        console.log('✅ 所有文件加载成功，脚本即将运行');

        // 将重要信息显示到状态栏
        if (window.logToStatusBar) {
            window.logToStatusBar('✅ 所有文件加载成功，脚本即将运行');
        }

        // 创建弹窗界面（包含CSS加载）
        createCoralPanel();


    }



    /**
     * 创建弹窗界面
     */

    console.capsule('Coral', '创建弹窗中');

    function createCoralPanel() {
        console.capsule('Coral', '注入窗口');

        /**
         * 加载CSS样式
         */
        console.log('🚀 即将加载css样式...');

        loadCSS();
        function loadCSS() {
            try {
                console.log('🚀 加载中...');
                // 直接嵌入CSS代码
                const cssText = `
/*
 * 清华社英语在线-自动答题 CSS样式文件
 * 版本: 1.0.1
 * 作者: FmCoral
 * 描述: 显示样式代码
 */

/* 主面板容器样式 - 创建浮动操作面板 */
.coralPanel {
    position: fixed;           /* 固定在屏幕上，不随页面滚动 */
    top: 100px;                /* 距离顶部100像素 */
    left: 100px;               /* 距离左侧100像素（初始位置，拖动时会更新） */
    width: 420px;              /* 面板宽度400像素 */
    padding: 24px;             /* 内边距24像素 */
    border-radius: 16px;       /* 圆角16像素 */
    background: rgba(255, 255, 255, 0.95);  /* 半透明白色背景 */
    color: #2D3748;            /* 文字颜色 */
    backdrop-filter: blur(20px);  /* 背景模糊效果 */
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05);  /* 双层阴影效果 */
    border: 1px solid rgba(255, 255, 255, 0.2);  /* 半透明边框 */
    z-index: 9999;             /* 最高层级，确保显示在最前面 */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Helvetica Neue", sans-serif;  /* 现代字体栈 */
    transition: box-shadow 0.3s ease;  /* 阴影过渡动画 */
}

/* 鼠标悬停时增强阴影效果 */
.coralPanel:hover {
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 面板标题样式 */
.coralPanel h1 {
    font-size: 20px;           /* 字体大小20像素 */
    font-weight: 700;          /* 粗体 */
    margin: 0 0 12px;          /* 下边距12像素 */
    text-align: center;        /* 居中对齐 */
    cursor: grab;              /* 抓取光标，用于拖动 */
    user-select: none;         /* 禁止文字选择 */
    color: #2D3748;            /* 文字颜色 */
    letter-spacing: -0.5px;    /* 字间距微调 */
}

/* 二级标题样式 */
.coralPanel h2 {
    font-size: 16px;           /* 字体大小16像素 */
    font-weight: 600;          /* 中等粗体 */
    color: #2D3748;            /* 文字颜色 */
    margin: 0 0 8px;           /* 下边距8像素 */
    display: flex;             /* 弹性布局 */
    align-items: center;       /* 垂直居中对齐 */
    gap: 8px;                  /* 元素间距8像素 */
}

/* 二级标题前的装饰线 */
.coralPanel h2:before {
    content: '';               /* 伪元素内容为空 */
    width: 4px;                /* 宽度4像素 */
    height: 16px;              /* 高度16像素 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 渐变背景 */
    border-radius: 2px;        /* 圆角2像素 */
}

/* 水平分割线样式 */
.coralPanel hr {
    border: none;              /* 移除默认边框 */
    border-top: 1px solid rgba(226, 232, 240, 0.8);  /* 顶部边框线 */
    margin: 12px 0;            /* 上下边距12像素 */
}

/* 段落容器样式 - 用于组织选项 */
.coralPanel > p {
    margin: 8px 0;             /* 上下边距8像素 */
    line-height: 1.5;          /* 行高1.5倍 */
    display: grid;             /* 网格布局 */
    grid-template-columns: repeat(3, minmax(0, 1fr));  /* 3列等宽网格 */
    gap: 8px 12px;             /* 行列间距 */
    align-items: center;       /* 垂直居中对齐 */
}

/* 复选框组容器样式 */
.coralPanel > p > .checkbox-group {
    margin: 0;                 /* 移除外边距 */
}

/* 复选框组样式 */
.coralPanel .checkbox-group {
    display: inline-flex;      /* 内联弹性布局 */
    align-items: center;       /* 垂直居中对齐 */
    gap: 8px;                  /* 元素间距8像素 */
    padding: 6px 0;            /* 上下内边距6像素 */
    transition: background 0.2s;  /* 背景色过渡动画 */
    border-radius: 8px;        /* 圆角8像素 */
}

/* 复选框组悬停效果 */
.coralPanel .checkbox-group:hover {
    background: rgba(237, 242, 247, 0.5);  /* 浅灰色背景 */
}

/* 复选框输入框样式 */
.coralPanel input[type="checkbox"] {
    width: 16px;               /* 宽度16像素 */
    height: 16px;              /* 高度16像素 */
    border-radius: 4px;        /* 圆角4像素 */
    border: 2px solid #CBD5E0;  /* 边框颜色 */
    background: white;          /* 白色背景 */
    cursor: pointer;           /* 指针光标 */
    transition: all 0.2s;      /* 所有属性过渡动画 */
    accent-color: #667eea;     /* 选中状态颜色 */
}

/* 复选框选中状态样式 */
.coralPanel input[type="checkbox"]:checked {
    background: #667eea;       /* 选中背景色 */
    border-color: #667eea;     /* 选中边框色 */
}

/* 复选框聚焦状态样式 */
.coralPanel input[type="checkbox"]:focus {
    outline: none;             /* 移除默认轮廓 */
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);  /* 聚焦阴影效果 */
}

/* 标签文字样式 */
.coralPanel label {
    font-size: 14px;           /* 字体大小14像素 */
    color: #4A5568;            /* 文字颜色 */
    cursor: pointer;           /* 指针光标 */
    font-weight: 500;          /* 中等粗体 */
    transition: color 0.2s;    /* 颜色过渡动画 */
}

/* 标签悬停效果 */
.coralPanel label:hover {
    color: #2D3748;            /* 悬停时文字颜色 */
}

/* 文本输入框样式 */
.coralPanel input[type="text"] {
    width: 80px;               /* 宽度80像素 */
    padding: 8px 12px;         /* 内边距 */
    border: 2px solid #E2E8F0;  /* 边框样式 */
    border-radius: 8px;       /* 圆角8像素 */
    font-size: 14px;           /* 字体大小14像素 */
    background: white;          /* 白色背景 */
    transition: all 0.2s;      /* 所有属性过渡动画 */
}

/* 文本输入框聚焦状态 */
.coralPanel input[type="text"]:focus {
    outline: none;             /* 移除默认轮廓 */
    border-color: #667eea;     /* 聚焦边框颜色 */
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);  /* 聚焦阴影效果 */
}

/* 按钮基础样式 */
.coralPanel button {
    padding: 10px 16px;        /* 内边距 */
    font-size: 14px;           /* 字体大小14像素 */
    font-weight: 600;          /* 粗体 */
    border: none;              /* 移除边框 */
    border-radius: 10px;       /* 圆角10像素 */
    cursor: pointer;           /* 指针光标 */
    transition: all 0.3s ease;  /* 所有属性过渡动画 */
    display: flex;             /* 弹性布局 */
    align-items: center;       /* 垂直居中对齐 */
    justify-content: center;   /* 水平居中对齐 */
    gap: 6px;                  /* 元素间距6像素 */
}

/* 按钮悬停效果（非禁用状态） */
.coralPanel button:not(:disabled):hover {
    transform: translateY(-1px);  /* 向上移动1像素 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);  /* 悬停阴影效果 */
}

/* 保存和重置按钮样式 */
.coralPanel #coral_save,
.coralPanel #coral_reset {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 渐变背景 */
    color: white;              /* 白色文字 */
    width: auto;               /* 自动宽度 */
    flex: 1;                   /* 弹性填充 */
    margin: 8px 4px;           /* 外边距 */
}

/* 保存和重置按钮悬停效果 */
.coralPanel #coral_save:hover,
.coralPanel #coral_reset:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);  /* 悬停渐变背景 */
}

/* 完成单个任务按钮样式 */
.coralPanel #coral_doone {
    background: #48BB78;        /* 绿色背景 */
    color: white;              /* 白色文字 */
    flex: 1;                   /* 弹性填充 */
    margin: 8px 4px;           /* 外边距 */
}

/* 完成单个任务按钮悬停效果 */
.coralPanel #coral_doone:hover {
    background: #38A169;        /* 悬停绿色背景 */
}

/* 开始按钮样式 */
.coralPanel #coral_start {
    background: linear-gradient(135deg, #F56565 0%, #E53E3E 100%);  /* 红色渐变背景 */
    color: white;              /* 白色文字 */
    flex: 1;                   /* 弹性填充 */
    margin: 8px 4px;           /* 外边距 */
}

/* 开始按钮悬停效果 */
.coralPanel #coral_start:hover {
    background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);  /* 悬停红色渐变背景 */
}

/* 关闭按钮样式 */
.coralPanel .close {
    position: absolute;        /* 绝对定位 */
    top: 16px;                 /* 距离顶部16像素 */
    right: 16px;               /* 距离右侧16像素 */
    width: 24px;               /* 宽度24像素 */
    height: 24px;              /* 高度24像素 */
    display: flex;             /* 弹性布局 */
    align-items: center;       /* 垂直居中对齐 */
    justify-content: center;   /* 水平居中对齐 */
    border-radius: 50%;        /* 圆形 */
    cursor: pointer;           /* 指针光标 */
    background: rgba(226, 232, 240, 0.8);  /* 半透明背景 */
    transition: all 0.2s;      /* 所有属性过渡动画 */
    color: #718096;            /* 文字颜色 */
}

/* 关闭按钮悬停效果 */
.coralPanel .close:hover {
    background: #E53E3E;        /* 红色背景 */
    color: white;              /* 白色文字 */
    transform: rotate(360deg);  /* 旋转360度 */
    transform-origin: center;  /* 旋转中心为元素中心 */
}

/* 关闭按钮的X符号 */
.coralPanel .close:before {
    content: '×';              /* 乘号字符 */
    font-size: 18px;           /* 字体大小18像素 */
    font-weight: bold;         /* 粗体 */
    line-height: 1;            /* 行高1倍 */
    display: flex;             /* 弹性布局 */
    align-items: center;       /* 垂直居中对齐 */
    justify-content: center;   /* 水平居中对齐 */
    width: 100%;               /* 宽度100% */
    height: 100%;              /* 高度100% */
    position: absolute;        /* 绝对定位 */
    top: 0;                    /* 顶部对齐 */
    left: 0;                   /* 左侧对齐 */
    transform: translate(0, 0); /* 重置位置 */
    font-family: Arial, sans-serif; /* 使用标准字体 */
}

/* 禁用状态按钮样式 */
.coralPanel button.is-disabled,
.coralPanel button:disabled {
    opacity: 0.6;              /* 透明度60% */
    cursor: not-allowed;       /* 禁止光标 */
    transform: none !important;  /* 移除变换效果 */
    box-shadow: none !important;  /* 移除阴影效果 */
}

/* 状态显示区域样式 */
.coralPanel #coral_status {
    font-size: 14px;           /* 字体大小14像素 */
    font-weight: 600;          /* 粗体 */
    text-align: center;        /* 居中对齐 */
    margin: 16px 0;            /* 上下边距16像素 */
    padding: 12px;             /* 内边距12像素 */
    border-radius: 12px;       /* 圆角12像素 */
    background: linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%);  /* 渐变背景 */
    border: 1px solid #E2E8F0;  /* 边框样式 */
    color: #4A5568;            /* 文字颜色 */
}`;

                GM_addStyle(cssText);
                console.log('✅ CSS已加载');

                // 将重要信息显示到状态栏
                if (window.logToStatusBar) {
                    window.logToStatusBar('✅ CSS已加载');
                }
            } catch (error) {
                console.warn('❌ CSS加载失败:', error);
            }
        }

        $(document.body).after(`
    <div class="coralPanel">
        <div class="close"></div>
        <h1 class="grabber">清华社 - 自动答题</h1>
        <hr>
        <h2>自动完成题型</h2>
       <p>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_tiankong">
                <label for="auto_tiankong">填空题</label>
            </span>
            
            <span class="checkbox-group">
                <input type="checkbox" id="auto_judge">
                <label for="auto_judge">判断题</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_drag">
                <label for="auto_drag">拖块题</label>
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
                <input type="checkbox" id="auto_video">
                <label for="auto_video">视频题</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_luyin">
                <label for="auto_luyin">无评分录音</label>
            </span>
            <span class="checkbox-group">
                <input type="checkbox" id="auto_lytk">
                <label for="auto_lytk">有评分录音</label>
            </span>
        </p>
        <hr>

        
        <h2>设置选项</h2>
        <p>
            <span class="checkbox-group">
                <input type="checkbox" id="set_tryerr">
                <label for="set_tryerr">自动试错</label>
            </span>
              <span class="checkbox-group">
                <input type="checkbox" id="set_auto">
                <label for="set_auto">自动重做</label>
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
         <p style="display: flex; gap: 4px; margin: 4px 0;">
            <button id="coral_save">💾 保存设置</button>
            <button id="coral_reset">🔄 恢复默认</button>
        </p>
        <hr>
        <h2 id="coral_status">状态栏</h2>
        <p style="display: flex; gap: 8px; margin: 16px 0;">
            <button id="coral_doone">🎯 只做一题</button>
            <button id="coral_start">🚀 开始答题</button>
        </p>
    </div>
`);

        // 窗口拖动 - 实时拖动
        let draging = false, startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

        $(document).mousemove((e) => {
            if (draging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                $('.coralPanel').css({
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
            const panel = $('.coralPanel');
            initialLeft = parseInt(panel.css('left')) || 0;
            initialTop = parseInt(panel.css('top')) || 0;
            e.preventDefault();
        });
        $(document).mouseup(() => { draging = false; });

        // 关闭按钮点击事件
        $('.coralPanel .close').click(function () {
            $('.coralPanel').fadeOut(300, function () {
                $(this).remove();
                console.log('✅ 弹窗已关闭');
            });
        });

        console.log('🚀 窗口拖动功能已加载');

        // 绑定按钮点击事件 - 确保在元素创建后绑定
        bindButtonEvents();

  

        // 将重要信息显示到状态栏
        if (window.logToStatusBar) {
            window.logToStatusBar('🚀 窗口拖动功能已加载');
            window.logToStatusBar('脚本加载完毕');
        }
    }

    /**
     * 绑定按钮点击事件
     */
    function bindButtonEvents() {
        console.log('🎯 开始绑定按钮事件...');

        // 检查按钮是否存在
        if ($('#coral_doone').length === 0) {
            console.error('❌ 按钮元素未找到，无法绑定事件');
            return;
        }

        // 先解绑可能存在的旧事件，避免重复绑定
        $('#coral_doone').off('click');

        //做一题按钮点击事件
        $('#coral_doone').click(function () {
            console.log('🎯 只做一题');

            // 将重要信息显示到状态栏
            if (window.logToStatusBar) {
                window.logToStatusBar('🎯 只做一题');
            }

            // 运行main.js
            
            loadMainScript('https://gitee.com/vip_user/tsinghuaelt/raw/main/EachPart/main.js');

        });
    }

    /**
     * 加载外部代码
     * @param {string} scriptUrl - 脚本URL地址
     */
    function loadMainScript(scriptUrl) {
        // 动态加载脚本
        const script = document.createElement('script');
        script.src = scriptUrl;
        document.head.appendChild(script);
    }
}
