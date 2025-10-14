/*
 * 清华社英语在线-工具函数库
 * 版本: 1.0.2
 * 最后更新: 2025年9月29日
 * 作者: FmCoral
 * 描述: 工具函数库
 */

// 版本信息
const UTILS_VERSION = '1.0.2';

console.log('🚀 工具函数调用...');

// 辅助函数
let vocabulary = ['fantastic', 'error', 'whatsoever', 'arouse', 'magnificent', 'remarkable', 'schoolwork', 'ease', 'devil', 'factor', 'outstanding', 'infinite', 'infinitely', 'accomplish', 'accomplished', 'mission', 'investigate', 'mysterious', 'analysis', 'peak', 'excellence', 'credit', 'responsibility', 'amount', 'entertain', 'alternative', 'irregular', 'grant', 'cease', 'concentration', 'adapt', 'weird', 'profit', 'alter', 'performance', 'echo', 'hallway', 'await', 'abortion', 'database', 'available', 'indecision', 'ban', 'predict', 'breakthrough', 'fate', 'host', 'pose', 'instance', 'expert', 'surgery', 'naval', 'aircraft', 'target', 'spoonful', 'navigation', 'numerous', 'fluent', 'mechanic', 'advertise', 'advertising', 'waken', 'enormous', 'enormously', 'oversleep', 'survey', 'best-selling', 'filmmaker', 'prosperous', 'involve'];
let phrases = ['Yes, he is', 'No, he isn\'t', 'Yes', 'No'];

// 获取随机单词
let getRanWord = () => { return vocabulary[parseInt(Math.random() * vocabulary.length)]; }

// 获取随机短语
let getRanPhrase = () => { return phrases[parseInt(Math.random() * phrases.length)]; }

// 异步等待函数
let sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }

// 点击提交按钮
let click_btn = () => { $('.wy-course-bottom .wy-course-btn-right .wy-btn').click(); }

// 配置常量
const submitDelay = 3000;       // Submit 之后的等待时间
const pageNextDelay = 5000;     // 换页 之后的等待时间
const inputDelay = 500;         // 输入 之后的等待时间

//填空题自动输入
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

// 题型检测工具

// 检测当前页面题型
function detectQuestionType() {
    console.log('[+] 开始检测当前题型...');
    
    // 填空题检测
    if ($('.lib-fill-blank-do-input-left').length > 0) {
        return '填空题';
    }
    
    // 单选题检测
    if ($('.lib-single-item-img').length > 0) {
        return '单选题';
    }
    
    // 多选题检测
    if ($('.lib-single-item-img img[src="assets/exercise/no-choices.png"]').length > 0) {
        return '多选题';
    }
    
    // 判断题检测
    if ($('.lib-judge-radio.lib-cursor.ng-star-inserted').length > 0) {
        return '判断题';
    }
    
    // 拖拽题检测
    if ($('.lib-drag-box').length > 0) {
        return '拖拽题';
    }
    
    // 文本填空检测
    if ($('.lib-textarea-container, .img-blank-answer').length > 0) {
        return '文本填空';
    }
    
    // 视频题检测
    if ($('#J_prismPlayer').length > 0) {
        return '视频题';
    }
    
    // 录音题检测
    if ($('img[title="录音"]').length > 0) {
        // 检测是否有原音按钮
        const hasSourceAudio = $('img[src*="source"], img[src*="参考"], img[src*="原音"], img[title*="source"], img[title*="参考"], img[title*="原音"]').length > 0;
        return hasSourceAudio ? '有评分录音' : '无评分录音';
    }
    
    // 角色扮演题检测
    if ($('.lib-role-select-item').length > 0) {
        return '角色扮演题';
    }
    
    return '未知题型';
}

// 检查是否在答题页面
function isInAnswerPage() {
    // 检查是否有提交按钮
    const hasSubmitButton = $('.wy-course-bottom .wy-course-btn-right .wy-btn').text().indexOf('Submit') != -1;
    
    // 检查是否有任何题型元素
    const hasQuestionElements = (
        $('.lib-fill-blank-do-input-left').length > 0 ||
        $('.lib-single-item-img').length > 0 ||
        $('.lib-judge-radio').length > 0 ||
        $('.lib-drag-box').length > 0 ||
        $('.lib-textarea-container').length > 0 ||
        $('#J_prismPlayer').length > 0 ||
        $('img[title="录音"]').length > 0
    );
    
    return hasSubmitButton || hasQuestionElements;
}



// 填空题答题逻辑
async function doTianKone(inputDelay = 500, submitDelay = 3000) {
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

// 单选题答题逻辑


// 多选题答题逻辑

// 判断题答题逻辑

// 根据题型调用对应的答题函数


// 导出工具函数
window.TsinghuaELTUtils = {
    getRanWord,
    getRanPhrase,
    sleep,
    click_btn,
    input_in,
    doTianKone,
    detectQuestionType,
    isInAnswerPage
};

// 工具函数库 - 只包含函数定义
// 启动逻辑由user脚本控制

