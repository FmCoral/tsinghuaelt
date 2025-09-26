// ==UserScript==
// @name         清华社英语在线-本地版
// @version      1.0.1
// @description  本版本修复bug，下一个版本将集成css文件
// @author       FmCoral
// @match        *://www.tsinghuaelt.com/*
// @run-at       document-start
// @icon         https://github.com/FmCoral/tsinghuaelt/raw/main/logo.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @require      file:///E:/桌面/tsinghuaelt/EachPart/main.js
// @require      file:///E:/桌面/tsinghuaelt/EachPart/utils.js
// @resource     jquery https://code.jquery.com/jquery-3.5.1.min.js
// @connect      *
// @updateURL    https://github.com/FmCoral/tsinghuaelt
// @downloadURL  https://github.com/FmCoral/tsinghuaelt
// ==/UserScript==

(function() {
    'use strict';
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('🚀 脚本开始初始化...');
        
        // 检查关键文件中的关键函数是否存在
        const hasMain = typeof startAuto === 'function';
        const hasUtils = typeof input_in === 'function';
        
        
        
        console.log('📊 文件加载状态:');
        console.log('  main.js :', hasMain ? '✅ 已加载' : '❌ 未加载');
        console.log('  utils.js :', hasUtils ? '✅ 已加载' : '❌ 未加载');
        
        if (!hasMain || !hasUtils ) {
            // 有文件未加载，显示错误弹窗
            showErrorPopup(hasMain, hasUtils);
            return; // 停止执行
        }
        
        // 所有文件都加载成功，正常运行
        runScript();
    }
    
    /**
     * 显示错误弹窗
     */
    function showErrorPopup(hasMain, hasUtils) {    
        console.log('❌ 有文件加载失败，显示错误弹窗');
        
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
        if (!hasMain) failedFiles.push('main.js');
        if (!hasUtils) failedFiles.push('utils.js');
        
        const errorMessage = failedFiles.length > 0 
            ? `以下文件加载失败：${failedFiles.join(', ')}`
            : '未知错误';
        
        popupContent.innerHTML = `
            <h2 style="color: #dc3545; margin: 0 0 20px 0; font-size: 24px;">
                ❌ 脚本加载失败
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">
                    📁 文件加载状态
                </h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 8px 0; background: white; border-radius: 6px; border-left: 4px solid ${hasMain ? '#28a745' : '#dc3545'};">
                    <div style="text-align: left;">
                        <strong>main.js</strong><br>
                        <small style="color: #6c757d;">主逻辑文件</small>
                    </div>
                    <div style="color: ${hasMain ? '#28a745' : '#dc3545'}; font-weight: bold;">
                        ${hasMain ? '✅ 已加载' : '❌ 加载失败'}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 8px 0; background: white; border-radius: 6px; border-left: 4px solid ${hasUtils ? '#28a745' : '#dc3545'};">
                    <div style="text-align: left;">
                        <strong>utils.js</strong><br>
                        <small style="color: #6c757d;">工具函数库</small>
                    </div>
                    <div style="color: ${hasUtils ? '#28a745' : '#dc3545'}; font-weight: bold;">
                        ${hasUtils ? '✅ 已加载' : '❌ 加载失败'}
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
            closeBtn.addEventListener('click', function() {
                const popup = document.getElementById('tsinghuaelt-error-popup');
                if (popup) {
                    popup.remove();
                }
            });
        }
        
        if (reloadBtn) {
            reloadBtn.addEventListener('click', function() {
                location.reload();
            });
        }
        
        console.log('✅ 错误弹窗已显示');
    }
    
    /**
     * 正常运行脚本
     */
    function runScript() {
        console.log('✅ 所有文件加载成功，脚本正常运行');
        
        // 加载CSS样式
        loadCSS();
        
        // 创建工具界面
        createToolInterface();
        
        // 启动主逻辑（由main.js提供）
        if (typeof startAuto === 'function') {
            startAuto();
        }
    }
    
    /**
     * 加载CSS样式
     */
    function loadCSS() {
        try {
            // 直接嵌入CSS代码
            const cssText = `
/*
 * 清华社英语在线-拆分版 CSS样式文件
 * 版本: 1.0.1
 * 最后更新: 2024年
 * 作者: FmCoral
 * 描述: 显示样式代码
 */

/* 面板容器样式 */
.tsinghuaelt-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    border: 2px solid #007acc;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 10000;
    min-width: 280px;
    max-width: 400px;
    font-family: 'Segoe UI', Arial, sans-serif;
}

/* 面板头部 */
.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9ecef;
}

.panel-header h3 {
    margin: 0;
    color: #007acc;
    font-size: 18px;
    font-weight: 600;
}

/* 表单控件样式 */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #495057;
    font-weight: 500;
    font-size: 14px;
}

.form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
}

.form-control:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0,122,204,0.2);
}

/* 按钮组样式 */
.btn-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn {
    flex: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background: #007acc;
    color: white;
}

.btn-primary:hover {
    background: #005a9e;
    transform: translateY(-1px);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn-success {
    background: #28a745;
    color: white;
}

.btn-success:hover {
    background: #1e7e34;
}

/* 状态显示样式 */
.status-display {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 10px;
    margin-top: 15px;
    font-size: 13px;
}

.status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.status-item:last-child {
    margin-bottom: 0;
}

.status-label {
    color: #6c757d;
}

.status-value {
    font-weight: 500;
}

.status-success {
    color: #28a745;
}

.status-warning {
    color: #ffc107;
}

.status-error {
    color: #dc3545;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tsinghuaelt-panel {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .btn-group {
        flex-direction: column;
    }
}

/* 工具界面样式 */
.tsinghuaelt-tool {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    border: 2px solid #007acc;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    min-width: 200px;
}

.tsinghuaelt-tool h3 {
    margin: 0 0 10px 0;
    color: #007acc;
    font-size: 16px;
}
`;
            
            GM_addStyle(cssText);
            console.log('✅ CSS样式加载成功');
        } catch (error) {
            console.warn('❌ CSS加载失败:', error);
        }
    }
    

    
    /**
     * 创建工具界面
     */
    function createToolInterface() {
        const toolDiv = document.createElement('div');
        toolDiv.id = 'tsinghuaelt-tool';
        toolDiv.className = 'tsinghuaelt-tool';
        
        toolDiv.innerHTML = `
            <h3>清华社英语工具</h3>
            <div style="color: #28a745; font-weight: bold;">✅ 所有文件加载成功</div>
            <div style="color: #6c757d; font-size: 12px; margin-top: 10px;">脚本正常运行中...</div>
        `;
        
        document.body.appendChild(toolDiv);
        console.log('✅ 工具界面创建完成');
    }
})();
