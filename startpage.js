document.addEventListener('DOMContentLoaded', () => {
    const engineButtons = document.querySelectorAll('.engine-btn');
    const engineNameEl = document.querySelector('[data-engine-name]');
    const engineDescriptionEl = document.getElementById('engineDescription');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    const engines = {
        google: {
            label: '谷歌',
            action: 'https://www.google.com/search',
            param: 'q',
            placeholder: '和朱迪一起发现新鲜事',
            description: '全球范围的权威结果，适合探索任何灵感。'
        },
        baidu: {
            label: '百度',
            action: 'https://www.baidu.com/s',
            param: 'wd',
            placeholder: '在百度上找点灵感',
            description: '中文语境下一站式搜索，覆盖本地资讯。'
        },
        bing: {
            label: '必应',
            action: 'https://www.bing.com/search',
            param: 'q',
            placeholder: '和尼克一起换个角度',
            description: '微软必应，提供更具启发的视觉化结果。'
        },
        googleLinux: {
            label: '谷歌 · linux.do',
            action: 'https://www.google.com/search',
            param: 'q',
            prefix: 'site:linux.do ',
            placeholder: '在 linux.do 中精准检索',
            description: '限定在 linux.do 的站内搜索，捕捉话题与讨论。'
        },
        googleNodeseek: {
            label: '谷歌 · NodeSeek',
            action: 'https://www.google.com/search',
            param: 'q',
            prefix: 'site:nodeseek.com ',
            placeholder: 'NodeSeek 的一切尽在掌握',
            description: '定位到 nodeseek.com，快速找到高质量内容。'
        }
    };

    let currentEngine = 'google';

    const applyEngine = (key) => {
        const config = engines[key];
        if (!config) return;
        currentEngine = key;
        engineButtons.forEach((btn) => {
            const isActive = btn.dataset.engine === key;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
        engineNameEl.textContent = config.label;
        engineDescriptionEl.textContent = config.description;
        searchInput.placeholder = config.placeholder;
        searchInput.focus();
    };

    engineButtons.forEach((button) => {
        button.addEventListener('click', () => {
            applyEngine(button.dataset.engine);
        });
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (!query) {
            searchInput.focus();
            return;
        }
        const engine = engines[currentEngine];
        if (!engine) return;
        const prefix = engine.prefix || '';
        const url = new URL(engine.action);
        url.searchParams.set(engine.param, `${prefix}${query}`);
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
    });

    applyEngine(currentEngine);
});
