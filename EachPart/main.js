/*
 * 清华社英语在线-主逻辑文件
 * 版本: 1.0.1
 * 最后更新: 2024年
 * 作者: FmCoral
 * 描述: 自动答题主逻辑
 */

/**
 * 清华社英语自动答题 - 主逻辑
 */

// 主控制器类
class TsinghuaELTController {
    constructor() {
        this.isRunning = false;
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.config = {};
        this.init();
    }

    // 初始化
    async init() {
        console.log('🚀 清华社英语自动答题系统启动中...');
        
        // 等待工具库加载
        await this.waitForUtils();
        
        // 加载配置
        this.config = window.TsinghuaELTUtils.ConfigManager.loadConfig();
        
        // 初始化UI
        this.initUI();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('✅ 系统初始化完成');
        this.updateStatus('系统就绪');
    }

    // 等待工具库加载
    waitForUtils() {
        return new Promise((resolve) => {
            const checkUtils = () => {
                if (window.TsinghuaELTUtils) {
                    resolve();
                } else {
                    setTimeout(checkUtils, 100);
                }
            };
            checkUtils();
        });
    }

    // 初始化UI
    initUI() {
        // 更新延迟输入框的值
        const delayInput = document.getElementById('set_delay');
        if (delayInput) {
            delayInput.value = this.config.delay || 10;
        }

        // 更新题型复选框状态
        this.updateQuestionTypeCheckboxes();
        
        console.log('🎨 UI初始化完成');
    }

    // 更新题型复选框状态
    updateQuestionTypeCheckboxes() {
        const questionTypes = this.config.questionTypes || {};
        
        // 为每种题型创建复选框 - 使用原生JavaScript查找包含特定文本的元素
        const h2Elements = document.querySelectorAll('.coralPanel h2');
        let questionTypesContainer = null;
        
        // 遍历h2元素，找到包含"自动完成题型"文本的那个
        for (const h2 of h2Elements) {
            if (h2.textContent.includes('自动完成题型')) {
                questionTypesContainer = h2.nextElementSibling;
                break;
            }
        }
        
        if (questionTypesContainer) {
            questionTypesContainer.innerHTML = '';
            
            const types = [
                { id: 'tiankong', label: '填空题', emoji: '🔤' },
                { id: 'danxuan', label: '单选题', emoji: '🔘' },
                { id: 'duoxuan', label: '多选题', emoji: '☑️' },
                { id: 'panduan', label: '判断题', emoji: '✅' },
                { id: 'pipei', label: '匹配题', emoji: '🔗' },
                { id: 'paixu', label: '排序题', emoji: '📊' },
                { id: 'luoyin', label: '录音题', emoji: '🎤' },
                { id: 'duanwen', label: '短文题', emoji: '📝' },
                { id: 'juzi', label: '句子题', emoji: '💬' }
            ];

            types.forEach(type => {
                const checkboxGroup = document.createElement('div');
                checkboxGroup.className = 'checkbox-group';
                checkboxGroup.innerHTML = `
                    <input type="checkbox" id="type_${type.id}" ${questionTypes[type.id] ? 'checked' : ''}>
                    <label for="type_${type.id}">${type.emoji} ${type.label}</label>
                `;
                questionTypesContainer.appendChild(checkboxGroup);
            });
        }
    }

    // 绑定事件
    bindEvents() {
        // 保存设置按钮
        const saveBtn = document.getElementById('yun_save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // 重置设置按钮
        const resetBtn = document.getElementById('yun_reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }

        // 只做一题按钮
        const doOneBtn = document.getElementById('yun_doone');
        if (doOneBtn) {
            doOneBtn.addEventListener('click', () => this.doOneQuestion());
        }

        // 开始答题按钮
        const startBtn = document.getElementById('yun_start');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAnswering());
        }

        // 关闭按钮
        const closeBtn = document.querySelector('.coralPanel .close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePanel());
        }

        // 面板拖动功能
        this.enableDragging();
        
        console.log('🔗 事件绑定完成');
    }

    // 保存设置
    saveSettings() {
        const delayInput = document.getElementById('set_delay');
        const delay = parseInt(delayInput.value) || 10;
        
        // 收集题型设置
        const questionTypes = {};
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="type_"]');
        checkboxes.forEach(checkbox => {
            const typeId = checkbox.id.replace('type_', '');
            questionTypes[typeId] = checkbox.checked;
        });

        this.config.delay = delay;
        this.config.questionTypes = questionTypes;
        
        window.TsinghuaELTUtils.ConfigManager.saveConfig(this.config);
        window.TsinghuaELTUtils.DOMUtils.showMessage('设置保存成功', 'success');
        
        console.log('💾 设置已保存:', this.config);
    }

    // 重置设置
    resetSettings() {
        this.config = window.TsinghuaELTUtils.ConfigManager.resetConfig();
        this.initUI();
        window.TsinghuaELTUtils.DOMUtils.showMessage('设置已重置为默认值', 'info');
        
        console.log('🔄 设置已重置');
    }

    // 只做一题
    async doOneQuestion() {
        if (this.isRunning) {
            window.TsinghuaELTUtils.DOMUtils.showMessage('系统正在运行中，请稍后再试', 'warning');
            return;
        }

        this.isRunning = true;
        this.updateStatus('正在处理当前题目...');
        
        try {
            // 检测当前题型
            const questionType = window.TsinghuaELTUtils.QuestionDetector.detectQuestionType();
            
            if (questionType === 'unknown') {
                window.TsinghuaELTUtils.DOMUtils.showMessage('未检测到题目页面', 'warning');
                this.updateStatus('未检测到题目');
                return;
            }

            // 检查是否启用该题型
            if (!this.config.questionTypes[questionType]) {
                window.TsinghuaELTUtils.DOMUtils.showMessage(`题型"${questionType}"未启用`, 'warning');
                this.updateStatus('题型未启用');
                return;
            }

            // 延迟
            await window.TsinghuaELTUtils.Delay.fixedDelay(2);
            
            // 答题
            const success = window.TsinghuaELTUtils.AnswerUtils.answerQuestion(questionType);
            
            if (success) {
                window.TsinghuaELTUtils.DOMUtils.showMessage('题目处理完成', 'success');
                this.updateStatus('题目处理完成');
            } else {
                window.TsinghuaELTUtils.DOMUtils.showMessage('题目处理失败', 'error');
                this.updateStatus('处理失败');
            }
            
        } catch (error) {
            console.error('❌ 处理题目时出错:', error);
            window.TsinghuaELTUtils.DOMUtils.showMessage('处理题目时出错', 'error');
            this.updateStatus('处理出错');
        } finally {
            this.isRunning = false;
        }
    }

    // 开始答题
    async startAnswering() {
        if (this.isRunning) {
            window.TsinghuaELTUtils.DOMUtils.showMessage('系统正在运行中', 'warning');
            return;
        }

        this.isRunning = true;
        this.updateStatus('开始自动答题...');
        
        try {
            // 检查是否在题目页面
            if (!window.TsinghuaELTUtils.QuestionDetector.isQuestionPage()) {
                window.TsinghuaELTUtils.DOMUtils.showMessage('请先进入题目页面', 'warning');
                this.updateStatus('请进入题目页面');
                return;
            }

            // 模拟答题过程
            for (let i = 1; i <= 10; i++) {
                if (!this.isRunning) break;
                
                this.updateStatus(`正在处理第 ${i} 题...`);
                
                // 检测题型并答题
                const questionType = window.TsinghuaELTUtils.QuestionDetector.detectQuestionType();
                if (questionType !== 'unknown' && this.config.questionTypes[questionType]) {
                    window.TsinghuaELTUtils.AnswerUtils.answerQuestion(questionType);
                }
                
                // 延迟
                await window.TsinghuaELTUtils.Delay.fixedDelay(this.config.delay);
                
                // 模拟下一题（实际应用中需要真实的翻页逻辑）
                console.log(`📄 模拟翻页到第 ${i + 1} 题`);
            }
            
            if (this.isRunning) {
                window.TsinghuaELTUtils.DOMUtils.showMessage('自动答题完成', 'success');
                this.updateStatus('答题完成');
            }
            
        } catch (error) {
            console.error('❌ 自动答题出错:', error);
            window.TsinghuaELTUtils.DOMUtils.showMessage('自动答题出错', 'error');
            this.updateStatus('答题出错');
        } finally {
            this.isRunning = false;
        }
    }

    // 隐藏面板
    hidePanel() {
        const panel = document.querySelector('.coralPanel');
        if (panel) {
            panel.style.display = 'none';
            window.TsinghuaELTUtils.DOMUtils.showMessage('面板已隐藏，刷新页面可重新显示', 'info');
        }
    }

    // 启用拖动功能
    enableDragging() {
        const panel = document.querySelector('.coralPanel');
        const grabber = document.querySelector('.coralPanel .grabber');
        
        if (!panel || !grabber) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        grabber.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            grabber.style.cursor = 'grabbing';
            panel.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            panel.style.left = (initialLeft + deltaX) + 'px';
            panel.style.top = (initialTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                grabber.style.cursor = 'grab';
                panel.style.userSelect = 'auto';
            }
        });
    }

    // 更新状态显示
    updateStatus(message) {
        const statusElement = document.getElementById('yun_status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    // 停止答题
    stopAnswering() {
        this.isRunning = false;
        this.updateStatus('已停止');
        window.TsinghuaELTUtils.DOMUtils.showMessage('答题已停止', 'info');
    }
}

// 主逻辑文件 - 只包含类定义和函数定义
// 启动逻辑由user脚本控制

