// ==UserScript==
// @name         骨碌碌 Emoji / 颜文字悬浮球
// @namespace    https://github.com/asasora/gululu-emoji-helper
// @version      0.5.0
// @description  在骨碌碌页面添加 Emoji / 颜文字悬浮球，支持最近使用和自定义添加
// @author       Kototsuki
// @match        *://www.gululu.world/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEYS = {
        customEmoji: 'gll_emoji_custom_emoji_v1',
        customKaomoji: 'gll_emoji_custom_kaomoji_v1',
        recentEmoji: 'gll_emoji_recent_emoji_v1',
        recentKaomoji: 'gll_emoji_recent_kaomoji_v1'
    };


    const MAX_RECENT = 6;

    const BASE_EMOJI_LIST = [
        { emoji: '😀', name: '开心', keys: [':kaixin:', ':smile:', ':开心:'] },
        { emoji: '😄', name: '大笑', keys: [':daxiao:', ':haha:', ':大笑:'] },
        { emoji: '😂', name: '笑哭', keys: [':xiao:', ':xiaoku:', ':笑哭:'] },
        { emoji: '🤣', name: '笑死', keys: [':xiaosi:', ':笑死:'] },
        { emoji: '😊', name: '微笑', keys: [':weixiao:', ':微笑:'] },
        { emoji: '🥰', name: '喜欢', keys: [':xihuan:', ':喜欢:'] },
        { emoji: '😍', name: '爱了', keys: [':aile:', ':爱了:'] },
        { emoji: '😘', name: '亲亲', keys: [':qq:', ':亲亲:'] },

        { emoji: '😅', name: '尴尬', keys: [':ganga:', ':尴尬:'] },
        { emoji: '😭', name: '哭', keys: [':ku:', ':cry:', ':哭:'] },
        { emoji: '😡', name: '生气', keys: [':shengqi:', ':angry:', ':生气:'] },
        { emoji: '😤', name: '哼', keys: [':heng:', ':哼:'] },
        { emoji: '😱', name: '震惊', keys: [':zhenjing:', ':震惊:'] },
        { emoji: '🤔', name: '思考', keys: [':sikao:', ':think:', ':思考:'] },
        { emoji: '😏', name: '斜眼笑', keys: [':xieyan:', ':斜眼:'] },
        { emoji: '🙃', name: '倒脸', keys: [':daolian:', ':倒脸:'] },
        { emoji: '🫠', name: '融化', keys: [':ronghua:', ':融化:'] },
        { emoji: '🫡', name: '敬礼', keys: [':jingli:', ':salute:', ':敬礼:'] },

        { emoji: '👍', name: '赞', keys: [':zan:', ':good:', ':赞:'] },
        { emoji: '👎', name: '踩', keys: [':cai:', ':bad:', ':踩:'] },
        { emoji: '🙏', name: '拜托', keys: [':baituo:', ':pray:', ':拜托:'] },
        { emoji: '👏', name: '鼓掌', keys: [':guzhang:', ':clap:', ':鼓掌:'] },
        { emoji: '👀', name: '看', keys: [':kan:', ':eyes:', ':看:'] },
        { emoji: '🤝', name: '握手', keys: [':woshou:', ':握手:'] },

        { emoji: '❤️', name: '红心', keys: [':xin:', ':love:', ':心:'] },
        { emoji: '💔', name: '心碎', keys: [':xinsui:', ':心碎:'] },
        { emoji: '🔥', name: '火', keys: [':huo:', ':fire:', ':火:'] },
        { emoji: '🎉', name: '庆祝', keys: [':qingzhu:', ':gx:', ':庆祝:'] },
        { emoji: '⭐', name: '星星', keys: [':xing:', ':star:', ':星星:'] },
        { emoji: '💯', name: '满分', keys: [':100:', ':manfen:', ':满分:'] },

        { emoji: '✅', name: '正确', keys: [':dui:', ':yes:', ':正确:'] },
        { emoji: '❌', name: '错误', keys: [':cuo:', ':no:', ':错误:'] },
        { emoji: '⚠️', name: '注意', keys: [':zhuyi:', ':warning:', ':注意:'] },

        { emoji: '💀', name: '寄', keys: [':ji:', ':skull:', ':寄:'] },
        { emoji: '🤡', name: '小丑', keys: [':xiaochou:', ':clown:', ':小丑:'] },
        { emoji: '🐶', name: '狗', keys: [':doge:', ':gou:', ':狗:'] },
        { emoji: '🐱', name: '猫', keys: [':mao:', ':cat:', ':猫:'] },
        { emoji: '🐟', name: '鱼', keys: [':yu:', ':fish:', ':鱼:'] },
        { emoji: '🍉', name: '吃瓜', keys: [':chigua:', ':瓜:', ':吃瓜:'] },
        { emoji: '☕', name: '咖啡', keys: [':kafei:', ':coffee:', ':咖啡:'] }
    ];

    const BASE_KAOMOJI_LIST = [
        { text: 'ヽ(✿ﾟ▽ﾟ)ノ', name: '开心' },
        { text: 'ヾ(≧▽≦*)o', name: '大笑' },
        { text: '٩(๑>◡<๑)۶', name: '高兴' },
        { text: '(๑•̀ㅂ•́)و✧', name: '加油' },
        { text: '(ง •̀_•́)ง', name: '奋斗' },
        { text: '(｀・ω・´)', name: '认真' },

        { text: '( ´･･)ﾉ(._.`)', name: '摸摸' },
        { text: '(つД`)ノ', name: '哭哭' },
        { text: '｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡', name: '大哭' },
        { text: '(；′⌒`)', name: '难过' },
        { text: '(´・ω・`)', name: '失落' },
        { text: '(´；ω；`)', name: '委屈' },

        { text: '(╯°□°）╯︵ ┻━┻', name: '掀桌' },
        { text: '┬─┬ ノ( ゜-゜ノ)', name: '扶桌' },
        { text: '(＃`Д´)', name: '生气' },
        { text: '(눈_눈)', name: '盯' },
        { text: '(¬_¬)', name: '斜眼' },
        { text: '(￣へ￣)', name: '不满' },

        { text: '(。・∀・)ノ', name: '打招呼' },
        { text: 'ヾ(￣▽￣) Bye~Bye~', name: '拜拜' },
        { text: '(￣▽￣)／', name: '挥手' },
        { text: '(*￣3￣)╭', name: '亲亲' },
        { text: '(づ￣ 3￣)づ', name: '抱抱' },

        { text: '(？_？)', name: '疑问' },
        { text: '(。_。)', name: '发呆' },
        { text: '(￣.￣)', name: '沉默' },
        { text: '(￣▽￣)"', name: '尴尬' },
        { text: 'Σ(っ °Д °;)っ', name: '震惊' },
        { text: '∑( 口 ||', name: '惊吓' },

        { text: '(๑•̀ㅁ•́ฅ)', name: '报告' },
        { text: 'φ(゜▽゜*)♪', name: '记录' },
        { text: 'ψ(｀∇´)ψ', name: '坏笑' },
        { text: '（￣︶￣）↗', name: '自信' },
        { text: 'o(*￣▽￣*)ブ', name: '招手' },
        { text: '(=・ω・=)', name: '猫猫' }
    ];

    const STYLE = `
        .gll-emoji-float-ball {
            position: fixed;
            right: 24px;
            bottom: 90px;
            z-index: 999998;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, .12);
            background: #ffffff;
            box-shadow: 0 4px 18px rgba(0, 0, 0, .18);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 25px;
            cursor: pointer;
            user-select: none;
            transition: transform .15s ease, box-shadow .15s ease;
        }

        .gll-emoji-float-ball:hover {
            transform: scale(1.06);
            box-shadow: 0 6px 24px rgba(0, 0, 0, .24);
        }

        .gll-emoji-panel {
            position: fixed;
            right: 24px;
            bottom: 150px;
            z-index: 999999;
            width: 360px;
            max-width: calc(100vw - 24px);
            max-height: 500px;
            overflow: hidden;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, .20);
            font-size: 14px;
            display: none;
        }

        .gll-emoji-header {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }

        .gll-emoji-tabs {
            display: flex;
            gap: 6px;
        }

        .gll-emoji-tab {
            border: 1px solid #ddd;
            background: #f7f7f7;
            color: #333;
            border-radius: 999px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
        }

        .gll-emoji-tab.active {
            background: #eaf5ff;
            border-color: #8fc7ff;
            color: #1677c9;
        }

        .gll-emoji-search {
            flex: 1;
            min-width: 0;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 6px 8px;
            font-size: 14px;
            outline: none;
        }

        .gll-emoji-search:focus {
            border-color: #8fc7ff;
            box-shadow: 0 0 0 2px rgba(120, 180, 255, .18);
        }

        .gll-emoji-close {
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 20px;
            color: #666;
            line-height: 1;
        }

        .gll-emoji-body {
            max-height: 395px;
            overflow: auto;
        }

        .gll-emoji-section-title {
            padding: 8px 10px 2px;
            color: #777;
            font-size: 12px;
        }

        .gll-emoji-recent-row {
            padding: 6px 8px 8px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
            border-bottom: 1px solid #f0f0f0;
        }

        .gll-emoji-grid {
            padding: 8px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
        }

        .gll-kaomoji-grid {
            padding: 8px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
        }

        .gll-emoji-item,
        .gll-emoji-add {
            border: 1px solid #eee;
            background: #fafafa;
            border-radius: 9px;
            cursor: pointer;
            padding: 6px 2px;
            min-height: 46px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
        }

        .gll-emoji-item:hover,
        .gll-emoji-add:hover {
            background: #f0f7ff;
            border-color: #a7d2ff;
        }

        .gll-emoji-char {
            font-size: 23px;
            line-height: 1;
        }

        .gll-emoji-key {
            font-size: 10px;
            color: #777;
            max-width: 48px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .gll-kaomoji-item,
        .gll-kaomoji-add {
            border: 1px solid #eee;
            background: #fafafa;
            border-radius: 9px;
            cursor: pointer;
            padding: 8px 6px;
            min-height: 44px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
        }

        .gll-kaomoji-item:hover,
        .gll-kaomoji-add:hover {
            background: #f0f7ff;
            border-color: #a7d2ff;
        }

        .gll-kaomoji-text {
            font-size: 14px;
            line-height: 1.2;
            word-break: break-all;
            text-align: center;
        }

        .gll-kaomoji-name {
            font-size: 10px;
            color: #777;
        }

        .gll-emoji-add-symbol {
            font-size: 24px;
            color: #777;
            line-height: 1;
        }

        .gll-emoji-tip {
            padding: 7px 10px 10px;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #eee;
            line-height: 1.5;
        }

        .gll-emoji-toast {
            position: fixed;
            left: 50%;
            bottom: 120px;
            transform: translateX(-50%);
            z-index: 1000000;
            background: rgba(0, 0, 0, .78);
            color: #fff;
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 13px;
            display: none;
            pointer-events: none;
        }

        .gll-emoji-manage {
    border: 1px solid #ddd;
    background: #f7f7f7;
    color: #333;
    border-radius: 999px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
}

.gll-emoji-manage.active {
    background: #fff0f0;
    border-color: #ff9a9a;
    color: #d93025;
}

.gll-emoji-item,
.gll-kaomoji-item {
    position: relative;
}

.gll-custom-delete {
    position: absolute;
    right: -5px;
    top: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ff4d4f;
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .25);
    z-index: 2;
}

.gll-custom-delete:hover {
    background: #d9363e;
}

@media (max-width: 520px) {
    .gll-emoji-panel {
        right: 12px;
        bottom: 135px;
        width: calc(100vw - 24px);
    }

    .gll-emoji-float-ball {
        right: 16px;
        bottom: 76px;
    }
}


        }
    `;

    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    let activeEditor = null;
    const savedSelection = new WeakMap();

    let panel = null;
    let ball = null;
    let currentTab = 'emoji';
    let currentKeyword = '';
    let manageMode = false;


    function readArray(key) {
        try {
            const raw = localStorage.getItem(key);
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            return [];
        }
    }

    function writeArray(key, arr) {
        localStorage.setItem(key, JSON.stringify(arr));
    }

    function uniquePush(arr, value, toFront = false) {
        const text = String(value || '').trim();
        if (!text) return arr;

        const filtered = arr.filter(item => item !== text);

        if (toFront) {
            filtered.unshift(text);
        } else {
            filtered.push(text);
        }

        return filtered;
    }

    function getCustomEmojiList() {
        return readArray(STORAGE_KEYS.customEmoji).map(text => ({
            emoji: text,
            name: '自定义',
            keys: [text],
            custom: true
        }));
    }

    function getEmojiList() {
        return BASE_EMOJI_LIST.concat(getCustomEmojiList());
    }

    function getCustomKaomojiList() {
        return readArray(STORAGE_KEYS.customKaomoji).map(text => ({
            text,
            name: '自定义',
            custom: true
        }));
    }

    function getKaomojiList() {
        return BASE_KAOMOJI_LIST.concat(getCustomKaomojiList());
    }

    function getRecentEmoji() {
        return readArray(STORAGE_KEYS.recentEmoji).slice(0, MAX_RECENT);
    }

    function addRecentEmoji(emoji) {
        let arr = readArray(STORAGE_KEYS.recentEmoji);
        arr = uniquePush(arr, emoji, true).slice(0, MAX_RECENT);
        writeArray(STORAGE_KEYS.recentEmoji, arr);
    }
    function getRecentKaomoji() {
        return readArray(STORAGE_KEYS.recentKaomoji).slice(0, MAX_RECENT);
    }

    function addRecentKaomoji(kaomoji) {
        let arr = readArray(STORAGE_KEYS.recentKaomoji);
        arr = uniquePush(arr, kaomoji, true).slice(0, MAX_RECENT);
        writeArray(STORAGE_KEYS.recentKaomoji, arr);
    }


    function addCustomEmoji() {
        const input = prompt(
            '请输入要添加的自定义 Emoji。\n可以是单个 emoji，也可以是一小段常用符号：',
            ''
        );

        const text = String(input || '').trim();

        if (!text) return;

        let arr = readArray(STORAGE_KEYS.customEmoji);
        arr = uniquePush(arr, text, false);
        writeArray(STORAGE_KEYS.customEmoji, arr);

        showToast('已添加自定义 Emoji');
        renderPanel();
    }

    function addCustomKaomoji() {
        const input = prompt(
            '请输入要添加的自定义颜文字：\n例如：(๑•̀ㅂ•́)و✧',
            ''
        );

        const text = String(input || '').trim();

        if (!text) return;

        let arr = readArray(STORAGE_KEYS.customKaomoji);
        arr = uniquePush(arr, text, false);
        writeArray(STORAGE_KEYS.customKaomoji, arr);

        showToast('已添加自定义颜文字');
        renderPanel();
    }
    function deleteCustomEmoji(text) {
        let arr = readArray(STORAGE_KEYS.customEmoji);
        arr = arr.filter(item => item !== text);
        writeArray(STORAGE_KEYS.customEmoji, arr);

        // 顺手从最近使用里也移除
        let recent = readArray(STORAGE_KEYS.recentEmoji);
        recent = recent.filter(item => item !== text);
        writeArray(STORAGE_KEYS.recentEmoji, recent);

        showToast('已删除自定义 Emoji');
        renderPanel();
    }

    function deleteCustomKaomoji(text) {
        let arr = readArray(STORAGE_KEYS.customKaomoji);
        arr = arr.filter(item => item !== text);
        writeArray(STORAGE_KEYS.customKaomoji, arr);

        // 顺手从最近使用里也移除
        let recent = readArray(STORAGE_KEYS.recentKaomoji);
        recent = recent.filter(item => item !== text);
        writeArray(STORAGE_KEYS.recentKaomoji, recent);

        showToast('已删除自定义颜文字');
        renderPanel();
    }


    function isInsideEmojiUI(el) {
        return !!(el && el.closest && el.closest('.gll-emoji-panel, .gll-emoji-float-ball'));
    }

    function isEditable(el) {
        if (!el || !(el instanceof HTMLElement)) return false;
        if (isInsideEmojiUI(el)) return false;

        if (el.disabled || el.readOnly) return false;

        const tag = el.tagName.toLowerCase();

        if (tag === 'textarea') return true;

        if (tag === 'input') {
            const type = (el.getAttribute('type') || 'text').toLowerCase();

            return [
                'text',
                'search',
                'url',
                'tel',
                'email',
                'password',
                ''
            ].includes(type);
        }

        if (el.isContentEditable) return true;
        if (el.getAttribute('role') === 'textbox') return true;

        return false;
    }

    function getEditableElement(el) {
        if (!el || !(el instanceof HTMLElement)) return null;

        if (isInsideEmojiUI(el)) return null;

        if (isEditable(el)) return el;

        const parentEditable = el.closest(
            'textarea, input, [contenteditable="true"], [role="textbox"]'
        );

        if (parentEditable && isEditable(parentEditable)) {
            return parentEditable;
        }

        return null;
    }

    function saveCurrentSelection(el) {
        if (!isEditable(el)) return;

        if (typeof el.selectionStart === 'number') {
            savedSelection.set(el, {
                start: el.selectionStart,
                end: el.selectionEnd
            });
            return;
        }

        if (el.isContentEditable || el.getAttribute('role') === 'textbox') {
            const sel = window.getSelection();

            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);

                if (el.contains(range.commonAncestorContainer)) {
                    savedSelection.set(el, range.cloneRange());
                }
            }
        }
    }

    function setNativeValue(el, value) {
        const tag = el.tagName ? el.tagName.toLowerCase() : '';

        let prototype;

        if (tag === 'textarea') {
            prototype = window.HTMLTextAreaElement.prototype;
        } else if (tag === 'input') {
            prototype = window.HTMLInputElement.prototype;
        } else {
            el.value = value;
            return;
        }

        const ownSetter = Object.getOwnPropertyDescriptor(el, 'value')?.set;
        const protoSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (protoSetter && ownSetter !== protoSetter) {
            protoSetter.call(el, value);
        } else if (ownSetter) {
            ownSetter.call(el, value);
        } else {
            el.value = value;
        }
    }

    function dispatchInputEvent(el, data) {
        try {
            el.dispatchEvent(new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data
            }));
        } catch (e) {}

        try {
            el.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data
            }));
        } catch (e) {
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function getCurrentEditor() {
        const focused = getEditableElement(document.activeElement);

        if (focused) {
            activeEditor = focused;
            saveCurrentSelection(focused);
            return focused;
        }

        if (
            activeEditor &&
            document.body.contains(activeEditor) &&
            isEditable(activeEditor)
        ) {
            return activeEditor;
        }

        return null;
    }

    function insertTextToEditor(editor, text) {
        if (!editor) {
            showToast('请先点击一下要输入的文本框');
            return;
        }

        activeEditor = editor;

        if (typeof editor.value === 'string' && typeof editor.selectionStart === 'number') {
            editor.focus();

            const old = savedSelection.get(editor);

            let start = typeof editor.selectionStart === 'number' ? editor.selectionStart : editor.value.length;
            let end = typeof editor.selectionEnd === 'number' ? editor.selectionEnd : editor.value.length;

            if (old && typeof old.start === 'number') {
                start = old.start;
                end = old.end;
            }

            const value = editor.value;
            const newValue = value.slice(0, start) + text + value.slice(end);

            setNativeValue(editor, newValue);

            const pos = start + text.length;
            editor.setSelectionRange(pos, pos);

            savedSelection.set(editor, {
                start: pos,
                end: pos
            });

            dispatchInputEvent(editor, text);
            return;
        }

        if (editor.isContentEditable || editor.getAttribute('role') === 'textbox') {
            editor.focus();

            const sel = window.getSelection();
            let range = savedSelection.get(editor);

            if (!range || !editor.contains(range.commonAncestorContainer)) {
                range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(false);
            }

            sel.removeAllRanges();
            sel.addRange(range);

            range.deleteContents();

            const textNode = document.createTextNode(text);
            range.insertNode(textNode);

            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);

            savedSelection.set(editor, range.cloneRange());

            dispatchInputEvent(editor, text);
            return;
        }

        showToast('当前输入框暂不支持插入');
    }

    let toastTimer = null;

    function showToast(text) {
        let toast = document.querySelector('.gll-emoji-toast');

        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'gll-emoji-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = text;
        toast.style.display = 'block';

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.display = 'none';
        }, 1600);
    }

    function createEmojiButton(item, isRecent = false) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gll-emoji-item';
        btn.title = `${item.name || ''} ${(item.keys || []).join(' ')}`;

        const char = document.createElement('div');
        char.className = 'gll-emoji-char';
        char.textContent = item.emoji;

        const key = document.createElement('div');
        key.className = 'gll-emoji-key';
        key.textContent = isRecent ? '最近' : ((item.keys && item.keys[0]) || item.name || '');

        btn.appendChild(char);
        btn.appendChild(key);

        // 管理模式下，只有用户自定义 Emoji 显示删除按钮
        if (manageMode && item.custom && !isRecent) {
            const del = document.createElement('span');
            del.className = 'gll-custom-delete';
            del.textContent = '×';
            del.title = '删除这个自定义 Emoji';

            del.addEventListener('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            del.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (confirm(`确定删除这个自定义 Emoji 吗？\n\n${item.emoji}`)) {
                    deleteCustomEmoji(item.emoji);
                }
            });

            btn.appendChild(del);
        }

        btn.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        btn.addEventListener('click', function () {
            if (manageMode) return;

            const editor = getCurrentEditor();
            insertTextToEditor(editor, item.emoji);
            addRecentEmoji(item.emoji);
            renderPanel();
        });


        return btn;
    }


    function createKaomojiButton(item) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gll-kaomoji-item';
        btn.title = item.name || item.text;

        const text = document.createElement('div');
        text.className = 'gll-kaomoji-text';
        text.textContent = item.text;

        const name = document.createElement('div');
        name.className = 'gll-kaomoji-name';
        name.textContent = item.name || '颜文字';

        btn.appendChild(text);
        btn.appendChild(name);

        // 管理模式下，只有用户自定义颜文字显示删除按钮
        if (manageMode && item.custom) {
            const del = document.createElement('span');
            del.className = 'gll-custom-delete';
            del.textContent = '×';
            del.title = '删除这个自定义颜文字';

            del.addEventListener('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            del.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (confirm(`确定删除这个自定义颜文字吗？\n\n${item.text}`)) {
                    deleteCustomKaomoji(item.text);
                }
            });

            btn.appendChild(del);
        }

        btn.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        btn.addEventListener('click', function () {
            if (manageMode) return;

            const editor = getCurrentEditor();
            insertTextToEditor(editor, item.text);
            addRecentKaomoji(item.text);
            renderPanel();
        });


        return btn;
    }


    function createAddButton(type) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = type === 'emoji' ? 'gll-emoji-add' : 'gll-kaomoji-add';
        btn.title = type === 'emoji' ? '添加自定义 Emoji' : '添加自定义颜文字';

        const plus = document.createElement('div');
        plus.className = 'gll-emoji-add-symbol';
        plus.textContent = '+';

        const label = document.createElement('div');
        label.className = type === 'emoji' ? 'gll-emoji-key' : 'gll-kaomoji-name';
        label.textContent = '添加';

        btn.appendChild(plus);
        btn.appendChild(label);

        btn.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        btn.addEventListener('click', function () {
            if (type === 'emoji') {
                addCustomEmoji();
            } else {
                addCustomKaomoji();
            }
        });

        return btn;
    }

    function createPanel() {
        if (panel) return panel;

        panel = document.createElement('div');
        panel.className = 'gll-emoji-panel';

        const header = document.createElement('div');
        header.className = 'gll-emoji-header';

        const tabs = document.createElement('div');
        tabs.className = 'gll-emoji-tabs';

        const emojiTab = document.createElement('button');
        emojiTab.type = 'button';
        emojiTab.className = 'gll-emoji-tab active';
        emojiTab.dataset.tab = 'emoji';
        emojiTab.textContent = 'Emoji';

        const kaomojiTab = document.createElement('button');
        kaomojiTab.type = 'button';
        kaomojiTab.className = 'gll-emoji-tab';
        kaomojiTab.dataset.tab = 'kaomoji';
        kaomojiTab.textContent = '颜文字';

        tabs.appendChild(emojiTab);
        tabs.appendChild(kaomojiTab);

        const manageBtn = document.createElement('button');
        manageBtn.type = 'button';
        manageBtn.className = 'gll-emoji-manage';
        manageBtn.textContent = '管理';
        manageBtn.title = '管理自定义 Emoji / 颜文字';


        const search = document.createElement('input');
        search.className = 'gll-emoji-search';
        search.placeholder = '搜索';

        const close = document.createElement('button');
        close.className = 'gll-emoji-close';
        close.type = 'button';
        close.textContent = '×';

        const body = document.createElement('div');
        body.className = 'gll-emoji-body';

        const tip = document.createElement('div');
        tip.className = 'gll-emoji-tip';
        tip.textContent = '先点击骨碌碌的评论框、回复框或闲聊输入框，再点这里的 Emoji / 颜文字。';

        header.appendChild(tabs);
        header.appendChild(manageBtn);
        header.appendChild(search);
        header.appendChild(close);


        panel.appendChild(header);
        panel.appendChild(body);
        panel.appendChild(tip);

        document.body.appendChild(panel);

        emojiTab.addEventListener('mousedown', e => e.preventDefault());
        kaomojiTab.addEventListener('mousedown', e => e.preventDefault());

        manageBtn.addEventListener('mousedown', e => e.preventDefault());

        manageBtn.addEventListener('click', function () {
            manageMode = !manageMode;
            renderPanel();

            if (manageMode) {
                showToast('已进入管理模式');
            } else {
                showToast('已退出管理模式');
            }
        });


        emojiTab.addEventListener('click', function () {
            currentTab = 'emoji';
            currentKeyword = '';
            search.value = '';
            renderPanel();
        });

        kaomojiTab.addEventListener('click', function () {
            currentTab = 'kaomoji';
            currentKeyword = '';
            search.value = '';
            renderPanel();
        });

        search.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });

        search.addEventListener('input', function () {
            currentKeyword = search.value;
            renderPanel();
        });

        search.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hidePanel();
            }
        });

        close.addEventListener('click', hidePanel);

        renderPanel();

        return panel;
    }

    function renderPanel() {
        if (!panel) return;

        const body = panel.querySelector('.gll-emoji-body');
        const emojiTab = panel.querySelector('[data-tab="emoji"]');
        const kaomojiTab = panel.querySelector('[data-tab="kaomoji"]');
        const manageBtn = panel.querySelector('.gll-emoji-manage');
        const search = panel.querySelector('.gll-emoji-search');

        if (!body) return;

        if (emojiTab) {
            emojiTab.classList.toggle('active', currentTab === 'emoji');
        }

        if (kaomojiTab) {
            kaomojiTab.classList.toggle('active', currentTab === 'kaomoji');
        }

        if (manageBtn) {
            manageBtn.classList.toggle('active', manageMode);
            manageBtn.textContent = manageMode ? '退出管理' : '管理';
        }



        if (search) {
            search.placeholder = currentTab === 'emoji'
                ? '搜索 emoji / xiao / zan / 哭'
            : '搜索颜文字 / 开心 / 掀桌';
        }

        body.innerHTML = '';

        const kw = String(currentKeyword || '').trim().toLowerCase();

        if (currentTab === 'emoji') {
            if (!kw) {
                const recent = getRecentEmoji();

                const title = document.createElement('div');
                title.className = 'gll-emoji-section-title';
                title.textContent = recent.length ? '最近使用' : '最近使用：暂无';
                body.appendChild(title);

                if (recent.length) {
                    const recentRow = document.createElement('div');
                    recentRow.className = 'gll-emoji-recent-row';

                    for (const emoji of recent) {
                        recentRow.appendChild(createEmojiButton({
                            emoji,
                            name: '最近使用',
                            keys: ['最近']
                        }, true));
                    }

                    body.appendChild(recentRow);
                }
            }

            const title = document.createElement('div');
            title.className = 'gll-emoji-section-title';
            title.textContent = 'Emoji';
            body.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'gll-emoji-grid';

            const list = getEmojiList().filter(item => {
                if (!kw) return true;

                return item.name.toLowerCase().includes(kw) ||
                    item.emoji.includes(kw) ||
                    item.keys.some(k => k.toLowerCase().includes(kw));
            });

            for (const item of list) {
                grid.appendChild(createEmojiButton(item));
            }

            // 最后一个加号：添加自定义 Emoji
            grid.appendChild(createAddButton('emoji'));

            body.appendChild(grid);
            return;
        }

        if (currentTab === 'kaomoji') {
            if (!kw) {
                const recent = getRecentKaomoji();

                const recentTitle = document.createElement('div');
                recentTitle.className = 'gll-emoji-section-title';
                recentTitle.textContent = recent.length ? '最近使用' : '最近使用：暂无';
                body.appendChild(recentTitle);

                if (recent.length) {
                    const recentGrid = document.createElement('div');
                    recentGrid.className = 'gll-kaomoji-grid';

                    for (const text of recent) {
                        recentGrid.appendChild(createKaomojiButton({
                            text,
                            name: '最近'
                        }));
                    }

                    body.appendChild(recentGrid);
                }
            }

            const title = document.createElement('div');
            title.className = 'gll-emoji-section-title';
            title.textContent = '颜文字';
            body.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'gll-kaomoji-grid';

            const list = getKaomojiList().filter(item => {
                if (!kw) return true;

                return item.name.toLowerCase().includes(kw) ||
                    item.text.toLowerCase().includes(kw);
            });

            for (const item of list) {
                grid.appendChild(createKaomojiButton(item));
            }

            // 最后一个加号：添加自定义颜文字
            grid.appendChild(createAddButton('kaomoji'));

            body.appendChild(grid);
        }

    }

    function createBall() {
        if (ball) return ball;

        ball = document.createElement('div');
        ball.className = 'gll-emoji-float-ball';
        ball.title = 'Emoji / 颜文字助手';
        ball.textContent = '😊';

        ball.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        ball.addEventListener('click', function () {
            togglePanel();
        });

        document.body.appendChild(ball);

        return ball;
    }

    function togglePanel() {
        const p = createPanel();

        if (p.style.display === 'block') {
            hidePanel();
        } else {
            showPanel();
        }
    }

    function showPanel() {
        const p = createPanel();
        renderPanel();
        p.style.display = 'block';
    }

    function hidePanel() {
        if (panel) {
            panel.style.display = 'none';
        }
    }

    document.addEventListener('focusin', function (e) {
        const editor = getEditableElement(e.target);

        if (!editor) return;

        activeEditor = editor;
        saveCurrentSelection(editor);
    }, true);

    document.addEventListener('click', function (e) {
        const editor = getEditableElement(e.target);

        if (!editor) return;

        activeEditor = editor;
        saveCurrentSelection(editor);
    }, true);

    document.addEventListener('keyup', function (e) {
        const editor = getEditableElement(e.target);

        if (!editor) return;

        activeEditor = editor;
        saveCurrentSelection(editor);
    }, true);

    document.addEventListener('mouseup', function (e) {
        const editor = getEditableElement(e.target);

        if (!editor) return;

        activeEditor = editor;
        saveCurrentSelection(editor);
    }, true);

    document.addEventListener('selectionchange', function () {
        const editor = getEditableElement(document.activeElement);

        if (!editor) return;

        activeEditor = editor;
        saveCurrentSelection(editor);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hidePanel();
        }
    });

    document.addEventListener('mousedown', function (e) {
        if (!panel) return;
        if (panel.style.display !== 'block') return;

        if (isInsideEmojiUI(e.target)) return;

        hidePanel();
    }, true);

    createBall();
})();
