/*
 * 清华社英语在线-工具函数库
 * 版本: 1.0.1
 * 最后更新: 2024年
 * 作者: FmCoral
 * 描述: 工具函数库
 */

/**
 * 工具函数库 - 清华社英语自动答题
 */

// 配置管理工具
const ConfigManager = {
    // 保存配置到本地存储
    saveConfig: function(config) {
        try {
            localStorage.setItem('tsinghuaelt_config', JSON.stringify(config));
            console.log('✅ 配置保存成功');
            return true;
        } catch (error) {
            console.error('❌ 配置保存失败:', error);
            return false;
        }
    },

    // 从本地存储加载配置
    loadConfig: function() {
        try {
            const configStr = localStorage.getItem('tsinghuaelt_config');
            if (configStr) {
                return JSON.parse(configStr);
            }
        } catch (error) {
            console.error('❌ 配置加载失败:', error);
        }
        
        // 默认配置
        return {
            delay: 10,
            autoRetry: true,
            questionTypes: {
                tiankong: true,    // 填空题
                duoxuan: true,     // 多选题
                danxuan: true,     // 单选题
                panduan: true,     // 判断题
                pipei: true,       // 匹配题
                paixu: true,       // 排序题
                luoyin: true,      // 录音题
                duanwen: true,     // 短文题
                juzi: true         // 句子题
            }
        };
    },

    // 重置为默认配置
    resetConfig: function() {
        const defaultConfig = {
            delay: 10,
            autoRetry: true,
            questionTypes: {
                tiankong: true, duoxuan: true, danxuan: true, panduan: true,
                pipei: true, paixu: true, luoyin: true, duanwen: true, juzi: true
            }
        };
        this.saveConfig(defaultConfig);
        return defaultConfig;
    }
};

// 延迟函数
const Delay = {
    // 随机延迟（避免被检测）
    randomDelay: function(min = 8, max = 15) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`⏰ 延迟 ${delay} 秒`);
        return new Promise(resolve => setTimeout(resolve, delay * 1000));
    },

    // 固定延迟
    fixedDelay: function(seconds) {
        console.log(`⏰ 固定延迟 ${seconds} 秒`);
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
};

// DOM操作工具
const DOMUtils = {
    // 安全地获取元素
    $: function(selector) {
        return document.querySelector(selector);
    },

    // 安全地获取所有匹配元素
    $$: function(selector) {
        return document.querySelectorAll(selector);
    },

    // 创建元素
    createElement: function(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    // 显示消息
    showMessage: function(message, type = 'info') {
        const messageDiv = this.createElement('div', `message message-${type}`);
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#4299e1'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(messageDiv);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
};

// 题型检测工具
const QuestionDetector = {
    // 检测当前页面题型
    detectQuestionType: function() {
        const url = window.location.href;
        const pageTitle = document.title;
        
        // 根据URL和页面内容判断题型
        if (url.includes('tiankong') || pageTitle.includes('填空')) {
            return 'tiankong';
        } else if (url.includes('duoxuan') || pageTitle.includes('多选')) {
            return 'duoxuan';
        } else if (url.includes('danxuan') || pageTitle.includes('单选')) {
            return 'danxuan';
        } else if (url.includes('panduan') || pageTitle.includes('判断')) {
            return 'panduan';
        } else if (url.includes('pipei') || pageTitle.includes('匹配')) {
            return 'pipei';
        } else if (url.includes('paixu') || pageTitle.includes('排序')) {
            return 'paixu';
        } else if (url.includes('luoyin') || pageTitle.includes('录音')) {
            return 'luoyin';
        } else if (url.includes('duanwen') || pageTitle.includes('短文')) {
            return 'duanwen';
        } else if (url.includes('juzi') || pageTitle.includes('句子')) {
            return 'juzi';
        }
        
        return 'unknown';
    },

    // 检查是否在答题页面
    isQuestionPage: function() {
        return this.detectQuestionType() !== 'unknown';
    }
};

// 答题逻辑工具
const AnswerUtils = {
    // 填空题答题逻辑
    answerTiankong: function() {
        console.log('🔤 正在处理填空题...');
        // 这里实现填空题的自动答题逻辑
        return true;
    },

    // 单选题答题逻辑
    answerDanxuan: function() {
        console.log('🔘 正在处理单选题...');
        // 这里实现单选题的自动答题逻辑
        return true;
    },

    // 多选题答题逻辑
    answerDuoxuan: function() {
        console.log('☑️ 正在处理多选题...');
        // 这里实现多选题的自动答题逻辑
        return true;
    },

    // 判断题答题逻辑
    answerPanduan: function() {
        console.log('✅ 正在处理判断题...');
        // 这里实现判断题的自动答题逻辑
        return true;
    },

    // 根据题型调用对应的答题函数
    answerQuestion: function(questionType) {
        switch (questionType) {
            case 'tiankong':
                return this.answerTiankong();
            case 'danxuan':
                return this.answerDanxuan();
            case 'duoxuan':
                return this.answerDuoxuan();
            case 'panduan':
                return this.answerPanduan();
            default:
                console.warn('⚠️ 未知题型:', questionType);
                return false;
        }
    }
};

// 导出工具函数
window.TsinghuaELTUtils = {
    ConfigManager,
    Delay,
    DOMUtils,
    QuestionDetector,
    AnswerUtils
};

// 工具函数库 - 只包含函数定义
// 启动逻辑由user脚本控制

