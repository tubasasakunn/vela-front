// A self-contained, local-only interaction: no clipboard, network or OS access.
export const demoScript = String.raw`
(() => {
  const panel = document.querySelector('#demo-panel');
  const tabs = [...document.querySelectorAll('[data-mode][role=tab]')];
  const search = document.querySelector('#demo-search');
  const results = document.querySelector('#demo-results');
  const next = document.querySelector('#demo-next');
  const caption = document.querySelector('#demo-caption');
  const palette = document.querySelector('#palette');
  const pasted = document.querySelector('#pasted-text');
  const toast = document.querySelector('#demo-toast');
  const demo = document.querySelector('#demo');
  const keyButton = document.querySelector('#demo-keys');
  const guideTitle = document.querySelector('#guide-title');
  const guideHelp = document.querySelector('#guide-help');
  const shortcuts = {clipboard:'7', windows:'8', launcher:'9'};
  let opened = false;
  function guide() {
    const done = step === 1;
    const action = mode === 'windows' ? 'ウィンドウを並べる' : mode === 'launcher' ? 'アプリ検索を開く' : 'コピー履歴を開く';
    guideTitle.textContent = done ? 'できました！もう一度試せます' : opened ? '② 選んで、Enterで' + (mode === 'launcher' ? '開く' : '貼り付ける') : '① このキーで、' + action;
    guideHelp.textContent = done ? 'キーのボタンを押すと、最初から試せます。' : opened ? '↑ ↓ で選択。文字を入力すると絞り込めます。' : 'ControlとShiftを押しながら、数字の' + shortcuts[mode] + '。';
    const keys = done ? ['もう一度 ↻'] : opened ? ['Enter ↵'] : ['Control', 'Shift', shortcuts[mode]];
    keyButton.replaceChildren();
    keys.forEach((key, index) => {
      if (index) {const plus = document.createElement('span');plus.textContent = '+';plus.setAttribute('aria-hidden', 'true');keyButton.append(plus);}
      const cap = document.createElement('kbd');cap.textContent = key;keyButton.append(cap);
    });
    keyButton.setAttribute('aria-label', done ? 'もう一度試す' : opened ? 'Enterで選択を確定' : 'Control + Shift + ' + shortcuts[mode] + '：' + action);
    keyButton.disabled = opened && !done && !filtered.length;
    keyButton.setAttribute('aria-keyshortcuts', done ? '' : opened ? 'Enter' : 'Control+Shift+' + shortcuts[mode]);
  }
  function advance(focusSearch = true) {
    if (step === 1) {reset(mode);return;}
    if (mode === 'windows' || opened) {complete(filtered[selected]);return;}
    opened = true; panel.dataset.open = 'true'; palette.inert = false;
    caption.textContent = mode === 'launcher' ? 'アプリの名前を入力して、Enterで開いてみましょう。' : '履歴を選んで、Enterでメモに貼り付けてみましょう。';
    renderResults();
    if (focusSearch) search.focus({preventScroll:true});
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
    next.disabled = opened && step === 0 && filtered.length === 0;
    if (opened && step === 0) next.textContent = mode === 'launcher' ? (filtered[selected]?.title || 'アプリ') + 'を開く ↵' : '選んだ内容を貼り付ける ↵';
    guide();
  }
  function complete(item) {
    if (step === 1) { reset(mode); return; }
    if (mode !== 'windows' && !item) return;
    step = 1; panel.dataset.step = '1'; palette.inert = true;
    if (mode === 'clipboard') {
      pasted.textContent = item.title; pasted.classList.add('filled');
      toast.textContent = '✓ 貼り付けました';
      caption.textContent = '履歴から、そのまま貼り付け。前のアプリへコピーし直しに戻る必要はありません。';
    } else if (mode === 'windows') {
      toast.textContent = '✓ 左右に並びました'; caption.textContent = 'メモと参考ページが、左右ぴったりに。位置もサイズも、ドラッグせずに整えられます。';
    } else {
      panel.dataset.app = item.title === 'Safari' ? 'safari' : item.title === 'カレンダー' ? 'calendar' : 'notes';
      document.querySelector('.notes-window .window-bar>span:nth-child(2)').textContent = item.title;
      document.querySelector('.note-body h3').textContent = item.title === 'メモ' ? '新しいアイデアを書こう。' : item.title === 'Safari' ? '参考ページを見つけよう。' : '今週の予定を確認しよう。';
      document.querySelector('#menu-app').textContent = item.title;
      toast.textContent = '✓ ' + item.title + 'を開きました'; caption.textContent = '名前で探してEnter。Dockから探す代わりに、キーボードからアプリを呼び出せます。';
    }
    next.textContent = 'もう一度試す ↻'; next.disabled = false;
    guide();
    if (palette.contains(document.activeElement)) next.focus({preventScroll:true});
  }
  function reset(newMode) {
    mode = newMode; step = 0; selected = 0; opened = false; panel.dataset.open = 'false';
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
    caption.textContent = mode === 'windows' ? '重なったウィンドウを、左右にすっきり。' : mode === 'launcher' ? 'Dockから探さず、名前でアプリを呼び出してみましょう。' : 'コピーし直さず、前にコピーしたリンクを呼び出してみましょう。';
    renderResults();
    next.textContent = mode === 'windows' ? 'ウィンドウを並べる →' : mode === 'launcher' ? 'アプリ検索を開く →' : 'コピー履歴を開く →';
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {stopTour();reset(tab.dataset.mode);});
    tab.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index !== undefined) {event.preventDefault();stopTour();reset(tabs[index].dataset.mode);tabs[index].focus();}
    });
  });
  next.addEventListener('click', () => {stopTour();advance();});
  keyButton.addEventListener('click', () => {stopTour();advance();});
  document.addEventListener('keydown', event => {
    if (event.isComposing || event.repeat || event.defaultPrevented || !event.ctrlKey || !event.shiftKey || event.metaKey || event.altKey) return;
    const targetMode = Object.keys(shortcuts).find(key => event.code === 'Digit' + shortcuts[key]);
    if (!targetMode) return;
    const rect = document.querySelector('.key-guide').getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight || (!demo.contains(event.target) && event.target !== document.body)) return;
    event.preventDefault();stopTour();reset(targetMode);advance();
  });
  document.querySelector('#replay').addEventListener('click', () => {stopTour();reset(mode);});
  search.addEventListener('focus', stopTour);
  search.addEventListener('input', () => {stopTour();selected = 0;renderResults();});
  play.addEventListener('click', () => {
    if (tourTimers.length) {stopTour();return;}
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
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault();selected = Math.max(0,Math.min(filtered.length - 1,selected + (event.key === 'ArrowDown' ? 1 : -1)));renderResults();}
    if (event.key === 'Escape') {reset(mode);tabs.find(tab => tab.dataset.mode === mode).focus();}
  });
  reset(mode);
})();
`;
