// A self-contained, local-only interaction: no clipboard, network or OS access.
export const demoScript = String.raw`
(() => {
  const panel = document.querySelector('#demo-panel');
  const tabs = [...document.querySelectorAll('[data-mode][role=tab]')];
  const search = document.querySelector('#demo-search');
  const results = document.querySelector('#demo-results');
  const palette = document.querySelector('#palette');
  const pasted = document.querySelector('#pasted-text');
  const demo = document.querySelector('#demo');
  const keyButton = document.querySelector('#demo-keys');
  const guideTitle = document.querySelector('#guide-title');
  const guideHelp = document.querySelector('#guide-help');
  const shortcuts = {clipboard:'7', windows:'8', launcher:'9'};
  let opened = false;
  let status = '';
  function frameDemo() {
    const top = demo.getBoundingClientRect().top;
    if (top < 0 || panel.getBoundingClientRect().bottom > window.innerHeight) {
      // Align before focusing search; animated scrolling can be cancelled by focus.
      demo.scrollIntoView({block:'start',behavior:'instant'});
    }
  }
  function guide() {
    const action = mode === 'windows' ? (step === 1 ? 'ウィンドウの重なりを戻す' : 'ウィンドウを並べる') : mode === 'launcher' ? 'アプリ検索を開く' : 'コピー履歴を開く';
    guideTitle.textContent = opened ? '選んで、Enterで' + (mode === 'launcher' ? '開く' : '貼り付ける') : status || action;
    guideHelp.textContent = opened ? '↑ ↓ で選択・文字入力で検索・Escで閉じる' : status ? (mode === 'windows' ? '同じキーで、並べる・戻すを何度でも。' : '同じキーで、続けて' + (mode === 'launcher' ? '別のアプリを開けます。' : '履歴を取り出せます。')) : 'OptionとShiftを押しながら、数字の' + shortcuts[mode] + '。';
    const keys = opened ? ['Enter ↵'] : ['Option', 'Shift', shortcuts[mode]];
    keyButton.replaceChildren();
    keys.forEach((key, index) => {
      if (index) {const plus = document.createElement('span');plus.textContent = '+';plus.setAttribute('aria-hidden', 'true');keyButton.append(plus);}
      const cap = document.createElement('kbd');cap.textContent = key;keyButton.append(cap);
    });
    keyButton.setAttribute('aria-label', opened ? 'Enterで選択を確定' : 'Option + Shift + ' + shortcuts[mode] + '：' + action);
    keyButton.disabled = opened && !filtered.length;
    keyButton.setAttribute('aria-keyshortcuts', opened ? 'Enter' : 'Alt+Shift+' + shortcuts[mode]);
  }
  function openPalette(focusSearch = true) {
    if (!opened) {search.value = '';selected = 0;}
    opened = true; panel.dataset.open = 'true'; palette.inert = false;
    renderResults();
    if (focusSearch) search.focus({preventScroll:true});
  }
  function advance(focusSearch = true) {
    if (mode === 'windows' || opened) complete(filtered[selected]);
    else openPalette(focusSearch);
  }
  const clips = [
    {title:'https://studio.example/design',sub:'リンク · 2分前',icon:'↗'},
    {title:'火曜日の14時から、よろしくお願いします。',sub:'テキスト · 5分前',icon:'Aa'},
    {title:'デザインの打ち合わせ',sub:'テキスト · 12分前',icon:'Aa'}
  ];
  const apps = [{title:'メモ',sub:'アプリケーション',icon:'▤'}, {title:'Safari',sub:'アプリケーション',icon:'◈'}, {title:'カレンダー',sub:'アプリケーション',icon:'24'}];
  let mode = 'clipboard', step = 0, selected = 0, filtered = clips;
  const play = document.querySelector('#play-demo');
  let tourTimers = [];
  function stopTour() { tourTimers.forEach(clearTimeout); tourTimers = []; play.textContent = '▶ 自動で見る'; play.setAttribute('aria-pressed', 'false'); }
  function renderResults() {
    const query = search.value.toLowerCase();
    filtered = (mode === 'launcher' ? apps : clips).filter(item => item.title.toLowerCase().includes(query));
    selected = Math.max(0, Math.min(selected, filtered.length - 1));
    results.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement('p'); empty.className = 'empty'; empty.textContent = '見つかりません。別の言葉で検索してみてください。'; results.append(empty);
    }
    filtered.forEach((item, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'result' + (i === selected ? ' selected' : '');
      const icon = document.createElement('span'); icon.className = 'result-icon'; icon.textContent = item.icon;
      const text = document.createElement('span'), title = document.createElement('b'), sub = document.createElement('small');
      title.textContent = item.title; sub.textContent = item.sub; text.append(title, sub); button.append(icon, text);
      if (i === selected) { const key = document.createElement('kbd'); key.textContent = '↵'; button.append(key); }
      button.addEventListener('click', () => {stopTour();complete(item);}); results.append(button);
    });
    guide();
  }
  function complete(item) {
    if (mode !== 'windows' && !item) return;
    step = mode === 'windows' && step === 1 ? 0 : 1;
    panel.dataset.step = String(step); opened = false; panel.dataset.open = 'false'; palette.inert = true;
    if (mode === 'clipboard') {
      pasted.textContent = item.title; pasted.classList.add('filled');
      status = '✓ 貼り付けました';
    } else if (mode === 'windows') {
      status = step === 1 ? '✓ 左右に並びました' : '✓ 元の重なりに戻しました';
    } else {
      panel.dataset.app = item.title === 'Safari' ? 'safari' : item.title === 'カレンダー' ? 'calendar' : 'notes';
      document.querySelector('.notes-window .window-bar>span:nth-child(2)').textContent = item.title;
      document.querySelector('.note-body h3').textContent = item.title === 'メモ' ? '新しいアイデアを書こう。' : item.title === 'Safari' ? '参考ページを見つけよう。' : '今週の予定を確認しよう。';
      document.querySelector('#menu-app').textContent = item.title;
      status = '✓ ' + item.title + 'を開きました';
    }
    guide();
    if (palette.contains(document.activeElement)) keyButton.focus({preventScroll:true});
  }
  function reset(newMode) {
    mode = newMode; step = 0; selected = 0; opened = false; status = ''; panel.dataset.open = 'false';
    panel.dataset.mode = mode; panel.dataset.step = '0'; delete panel.dataset.app; panel.setAttribute('aria-labelledby', 'tab-' + mode);
    palette.inert = true;
    tabs.forEach(tab => {const active = tab.dataset.mode === mode;tab.setAttribute('aria-selected', String(active));tab.tabIndex = active ? 0 : -1;});
    pasted.textContent = 'ここにリンクを貼り付けたい'; pasted.classList.remove('filled');
    document.querySelector('.note-body h3').textContent = '次のアイデアを、形に。';
    document.querySelector('.notes-window .window-bar>span:nth-child(2)').textContent = '打ち合わせメモ';
    document.querySelector('#menu-app').textContent = 'メモ';
    document.querySelector('#palette-title').textContent = mode === 'launcher' ? 'アプリとコマンド' : 'クリップボード履歴';
    document.querySelector('#palette-action').textContent = mode === 'launcher' ? '開く' : '貼り付け';
    search.value = ''; search.placeholder = mode === 'launcher' ? 'アプリの名前を入力…' : 'コピーした内容を検索…';
    search.setAttribute('aria-label', mode === 'launcher' ? 'デモのアプリを検索' : 'デモのコピー履歴を検索');
    renderResults();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {stopTour();reset(tab.dataset.mode);frameDemo();});
    tab.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index !== undefined) {event.preventDefault();stopTour();reset(tabs[index].dataset.mode);tabs[index].focus();frameDemo();}
    });
  });
  keyButton.addEventListener('click', () => {stopTour();frameDemo();advance();});
  document.addEventListener('keydown', event => {
    if (event.isComposing || event.repeat || event.defaultPrevented || !event.altKey || !event.shiftKey || event.metaKey || event.ctrlKey) return;
    const targetMode = Object.keys(shortcuts).find(key => event.code === 'Digit' + shortcuts[key]);
    if (!targetMode) return;
    const rect = panel.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight || (!demo.contains(event.target) && event.target !== document.body)) return;
    event.preventDefault();stopTour();frameDemo();
    if (targetMode !== mode) reset(targetMode);
    if (mode === 'windows') complete();
    else openPalette();
  });
  search.addEventListener('focus', stopTour);
  search.addEventListener('input', () => {stopTour();selected = 0;renderResults();});
  play.addEventListener('click', () => {
    if (tourTimers.length) {stopTour();return;}
    frameDemo();
    play.textContent = 'Ⅱ 再生を止める'; play.setAttribute('aria-pressed', 'true'); reset('clipboard');
    const schedule = (delay, action) => tourTimers.push(setTimeout(action, delay));
    schedule(900, () => advance(false));
    schedule(2300, () => complete(clips[0]));
    schedule(4400, () => reset('windows'));
    schedule(6000, () => complete());
    schedule(8600, () => reset('launcher'));
    schedule(9400, () => advance(false));
    schedule(10000, () => {search.value = 'メモ';renderResults();});
    schedule(11600, () => complete(apps[0]));
    schedule(14000, stopTour);
  });
  document.addEventListener('visibilitychange', () => {if (document.hidden) stopTour();});
  search.addEventListener('keydown', event => {
    if (event.isComposing || event.keyCode === 229 || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    stopTour();
    if (event.key === 'Enter') {event.preventDefault();complete(filtered[selected]);}
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();selected = Math.max(0,Math.min(filtered.length - 1,selected + (event.key === 'ArrowDown' ? 1 : -1)));renderResults();
      results.querySelector('.selected')?.scrollIntoView({block:'nearest',behavior:'instant'});
    }
    if (event.key === 'Escape') {
      event.preventDefault();opened = false;panel.dataset.open = 'false';palette.inert = true;guide();keyButton.focus({preventScroll:true});
    }
  });
  reset(mode);
})();
`;
