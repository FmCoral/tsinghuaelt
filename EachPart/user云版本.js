// ==UserScript==
// @name         清华社英语在线-云版本
// @version      1.0.5
// @description  本次将尝试将脚本分化为四个部分，便于管理，已添加缓存处理机制
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
// @require      https://github.com/FmCoral/tsinghuaelt/raw/main/EachPart/main.js
// @require      https://github.com/FmCoral/tsinghuaelt/raw/main/EachPart/utils.js
// @resource     panelCSS https://github.com/FmCoral/tsinghuaelt/raw/main/EachPart/style.css
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
        
        // 检查CSS文件是否加载
        let hasCSS = false;
        try {
            if (typeof GM_getResourceText === 'function') {
                // 添加时间戳或随机数来尝试绕过缓存
                const timestamp = new Date().getTime();
                console.log(`🔄 当前加载时间戳: ${timestamp}`);
                
                // 获取CSS文件内容
                let cssText = GM_getResourceText('panelCSS');
                
                // 检查是否可能是缓存问题
                if (cssText && cssText.trim().length === 0) {
                    console.warn('⚠️ 警告：获取到的CSS内容为空，可能是缓存问题');
                    console.warn('🔧 解决方案：请尝试以下操作清除缓存：');
                    console.warn('   1. 重新安装脚本');
                    console.warn('   2. 在Tampermonkey中编辑脚本并保存（无需实际修改）');
                    console.warn('   3. 刷新页面并使用Ctrl+F5强制刷新');
                }
                
                console.log('🔍 CSS文件内容长度:', cssText ? cssText.length : 0);
                console.log('🔍 CSS修剪后长度:', cssText ? cssText.trim().length : 0);
                console.log('📝 CSS文件完整内容:', cssText);
                
                // 简单检查：只要内容不为空就认为加载成功
                hasCSS = cssText && cssText.trim().length > 0;
                
                if (hasCSS) {
                    console.log('✅ CSS文件检查通过');
                    // 保存当前加载的时间戳，用于检测是否使用了缓存
                    GM_setValue('lastCSSLoadTime', timestamp);
                } else {
                    console.log('❌ CSS文件检查失败：内容为空');
                    // 清除可能的缓存标记
                    GM_deleteValue('lastCSSLoadTime');
                }
            } else {
                console.log('❌ GM_getResourceText函数不可用');
                hasCSS = false;
            }
        } catch (error) {
            console.log('❌ CSS文件检查异常:', error);
            hasCSS = false;
        }
        
        console.log('📊 文件加载状态:');
        console.log('  main.js :', hasMain ? '✅ 已加载' : '❌ 未加载');
        console.log('  utils.js :', hasUtils ? '✅ 已加载' : '❌ 未加载');
        console.log('  style.css :', hasCSS ? '✅ 已加载' : '❌ 未加载');
        
        if (!hasMain || !hasUtils || !hasCSS) {
            // 有文件未加载，显示错误弹窗
            showErrorPopup(hasMain, hasUtils, hasCSS);
            return; // 停止执行
        }
        
        // 所有文件都加载成功，正常运行
        runScript();
    }
    
    /**
     * 显示错误弹窗
     */
    function showErrorPopup(hasMain, hasUtils, hasCSS) {
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
        if (!hasCSS) failedFiles.push('style.css');
        
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
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 8px 0; background: white; border-radius: 6px; border-left: 4px solid ${hasCSS ? '#28a745' : '#dc3545'};">
                    <div style="text-align: left;">
                        <strong>style.css</strong><br>
                        <small style="color: #6c757d;">样式文件</small>
                    </div>
                    <div style="color: ${hasCSS ? '#28a745' : '#dc3545'}; font-weight: bold;">
                        ${hasCSS ? '✅ 已加载' : '❌ 加载失败'}
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
        
        // 启动主逻辑
        if (typeof startAuto === 'function') {
            startAuto();
        }
    }
    
    /**
     * 加载CSS样式
     */
    function loadCSS() {
        try {
            if (typeof GM_addStyle === 'function' && typeof GM_getResourceText === 'function') {
                const cssText = GM_getResourceText('panelCSS');
                GM_addStyle(cssText);
                console.log('✅ CSS样式加载成功');
            } else {
                loadFallbackCSS();
            }
        } catch (error) {
            console.warn('❌ CSS加载失败，使用备用样式:', error);
            loadFallbackCSS();
        }
    }
    
    /**
     * 备用CSS样式
     */
    function loadFallbackCSS() {
        const fallbackCSS = `
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
        
        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);
        console.log('✅ 备用CSS样式加载成功');
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
