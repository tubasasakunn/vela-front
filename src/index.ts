const downloadURL = "https://github.com/tubasasakunn/vela/releases/download/v0.3.0/Vela-0.3.0.dmg";

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="A native macOS control surface that you configure in JavaScript." />
  <meta name="theme-color" content="#0d1725" />
  <meta property="og:title" content="Vela — Make your Mac answer to you." />
  <meta property="og:description" content="A native macOS launcher, clipboard history, window control, and more — configured in one JavaScript file." />
  <meta property="og:type" content="website" />
  <title>Vela — Make your Mac answer to you.</title>
  <style>
    :root { --night:#0d1725; --ink:#dfe9f2; --muted:#9badbd; --line:rgba(223,233,242,.17); --sea:#a7d5c8; --signal:#ff856b; --panel:#142235; --code:#0a1320; }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; color:var(--ink); background:var(--night); font:400 16px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif; -webkit-font-smoothing:antialiased; }
    a { color:inherit; }
    .shell { width:min(1160px,calc(100% - 48px)); margin:auto; }
    .site-header { height:76px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line); }
    .brand { display:flex; gap:11px; align-items:center; text-decoration:none; font-weight:650; letter-spacing:-.02em; font-size:20px; }
    .mark { width:28px; height:28px; position:relative; display:block; border:2px solid var(--sea); border-radius:50% 50% 40% 50%; transform:rotate(-24deg); }
    .mark:after { content:""; position:absolute; width:7px; height:7px; top:7px; left:8px; border-radius:50%; background:var(--signal); }
    nav { display:flex; align-items:center; gap:24px; color:var(--muted); font-size:14px; }
    nav a { text-decoration:none; }
    nav a:hover { color:var(--ink); }
    .hero { min-height:700px; padding:104px 0 72px; position:relative; overflow:hidden; }
    .orbit { position:absolute; width:760px; height:760px; border:1px solid rgba(167,213,200,.2); border-radius:50%; right:-330px; top:-245px; pointer-events:none; }
    .orbit:before, .orbit:after { content:""; position:absolute; border-radius:50%; border:1px solid rgba(167,213,200,.14); inset:92px; }
    .orbit:after { inset:188px; }
    .hero-grid { display:grid; grid-template-columns:minmax(0,1fr) minmax(420px,.9fr); gap:80px; align-items:center; position:relative; }
    h1 { max-width:690px; margin:0; font-size:clamp(54px,7vw,96px); font-weight:560; letter-spacing:-.075em; line-height:.94; }
    .lead { max-width:535px; color:var(--muted); font-size:20px; margin:28px 0 34px; }
    .actions { display:flex; flex-wrap:wrap; gap:14px; align-items:center; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height:49px; padding:0 20px; border:1px solid var(--sea); text-decoration:none; font-weight:650; border-radius:2px; }
    .button:hover { background:var(--sea); color:var(--night); }
    .button.secondary { border-color:var(--line); color:var(--muted); }
    .button.secondary:hover { color:var(--ink); background:transparent; border-color:var(--ink); }
    .install-note { width:100%; color:var(--muted); font-size:13px; margin:3px 0 0; }
    .control-surface { background:linear-gradient(145deg,#1a2a3d,#111d2d 68%); border:1px solid rgba(223,233,242,.25); box-shadow:20px 25px 0 rgba(0,0,0,.13); padding:14px; transform:rotate(2.3deg); }
    .surface-bar { display:flex; align-items:center; justify-content:space-between; color:var(--muted); font-size:12px; padding:2px 4px 13px; }
    .lights { display:flex; gap:6px; } .lights i { width:8px; height:8px; border-radius:50%; background:var(--line); } .lights i:first-child { background:var(--signal); }
    .palette { padding:13px; background:var(--code); border:1px solid rgba(223,233,242,.12); }
    .query { display:flex; align-items:center; gap:9px; padding:7px 8px 15px; color:#f0f6fb; font-size:17px; border-bottom:1px solid var(--line); }
    .cursor { width:7px; height:20px; background:var(--sea); display:inline-block; animation:blink 1s steps(2,end) infinite; }
    .result { display:flex; align-items:center; gap:12px; padding:12px 8px; color:var(--muted); }
    .result + .result { border-top:1px solid rgba(223,233,242,.08); }
    .result.active { margin:4px -3px; padding:12px 11px; color:var(--night); background:var(--sea); }
    .key { width:28px; text-align:center; padding:1px 4px; color:inherit; border:1px solid currentColor; border-radius:3px; font:12px ui-monospace,SFMono-Regular,Menlo,monospace; }
    .result b { font-size:14px; font-weight:600; } .result small { margin-left:auto; font-size:11px; }
    .section { border-top:1px solid var(--line); padding:110px 0; }
    .section h2 { margin:0; max-width:650px; font-size:clamp(36px,5vw,60px); line-height:1.05; letter-spacing:-.055em; font-weight:550; }
    .section-intro { margin:18px 0 0; max-width:575px; color:var(--muted); font-size:18px; }
    .capabilities { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin-top:64px; border-top:1px solid var(--line); border-left:1px solid var(--line); }
    .capability { min-height:220px; padding:28px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); }
    .capability span { color:var(--signal); font:14px ui-monospace,SFMono-Regular,Menlo,monospace; }
    .capability h3 { margin:38px 0 8px; font-size:21px; letter-spacing:-.03em; }
    .capability p { margin:0; color:var(--muted); font-size:14px; }
    .config { display:grid; grid-template-columns:.75fr 1.25fr; gap:80px; align-items:start; }
    .config-copy { position:sticky; top:32px; }
    .code { margin:0; overflow:auto; padding:28px; color:#c8d6e3; background:var(--code); border:1px solid var(--line); font:14px/1.75 ui-monospace,SFMono-Regular,Menlo,monospace; }
    .code .fn { color:var(--sea); } .code .str { color:#f4ba8d; } .code .comment { color:#6d8297; }
    .privacy { display:grid; grid-template-columns:1fr 1fr; gap:32px; padding:35px 0 0; }
    .privacy p { margin:0; color:var(--muted); font-size:17px; }
    .privacy strong { display:block; margin-bottom:8px; color:var(--ink); font-size:20px; letter-spacing:-.025em; }
    .closing { padding:135px 0; text-align:center; }
    .closing h2 { max-width:780px; margin:0 auto 26px; font-size:clamp(44px,6.2vw,82px); font-weight:550; letter-spacing:-.065em; line-height:.96; }
    footer { padding:28px 0 38px; border-top:1px solid var(--line); display:flex; gap:18px; flex-wrap:wrap; color:var(--muted); font-size:13px; }
    footer a { text-decoration:none; } footer a:hover { color:var(--ink); } footer span { margin-left:auto; }
    @keyframes blink { 50% { opacity:0; } }
    @media (max-width:800px) { .hero { min-height:auto; padding:74px 0 80px; } .hero-grid,.config { grid-template-columns:1fr; gap:50px; } .control-surface { max-width:540px; transform:none; } .capabilities { grid-template-columns:1fr; } .capability { min-height:0; } .capability h3 { margin-top:24px; } .config-copy { position:static; } .privacy { grid-template-columns:1fr; gap:24px; } }
    @media (max-width:540px) { .shell { width:min(100% - 32px,1160px); } .site-header { height:65px; } nav { gap:14px; } nav a:first-child { display:none; } h1 { font-size:54px; } .lead { font-size:17px; } .section { padding:80px 0; } .code { margin-left:-16px; margin-right:-16px; padding:21px 16px; font-size:12px; } footer span { width:100%; margin-left:0; } }
    @media (prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } .cursor { animation:none; } }
  </style>
</head>
<body>
  <header class="shell site-header">
    <a class="brand" href="/"><i class="mark" aria-hidden="true"></i>Vela</a>
    <nav><a href="#configure">Configure</a><a href="#privacy">Privacy</a></nav>
  </header>
  <main>
    <section class="hero"><div class="orbit"></div><div class="shell hero-grid">
      <div><h1>Make your Mac<br>answer to you.</h1><p class="lead">Vela is a native control surface for your Mac: launch what matters, keep what you copied, move your windows, and make every shortcut yours.</p><div class="actions"><a class="button" href="${downloadURL}">Download DMG</a><a class="button secondary" href="#configure">See the config</a><p class="install-note">Free · macOS 14+ · Apple silicon · Apple-notarized release</p></div></div>
      <div class="control-surface" aria-label="A Vela command palette illustration"><div class="surface-bar"><div class="lights"><i></i><i></i><i></i></div><span>Vela</span></div><div class="palette"><div class="query"><span class="cursor"></span>open work</div><div class="result active"><span class="key">↵</span><b>Open workspace</b><small>Command</small></div><div class="result"><span class="key">⌘V</span><b>Clipboard history</b><small>Recent</small></div><div class="result"><span class="key">⌥⇥</span><b>Switch application</b><small>Window</small></div></div></div>
    </div></section>
    <section class="section"><div class="shell"><h2>One place for the things you reach for every day.</h2><p class="section-intro">Vela stays native and out of the way until you call it. There is no settings labyrinth to learn.</p><div class="capabilities"><article class="capability"><span>01</span><h3>Find and run</h3><p>Open apps, invoke your own commands, and move through your work without breaking stride.</p></article><article class="capability"><span>02</span><h3>Remember context</h3><p>Search clipboard history, expand snippets, and select useful text directly from the screen.</p></article><article class="capability"><span>03</span><h3>Put windows where they belong</h3><p>Snap, maximize, minimize, and move windows between displays with a keystroke.</p></article></div></div></section>
    <section class="section" id="configure"><div class="shell config"><div class="config-copy"><h2>Configured in a file you can keep.</h2><p class="section-intro">Your Vela lives in normal JavaScript. Put it in Git, share it, or ask an agent to help refine it. The app validates your configuration before it adopts it.</p><p class="section-intro">Start with <code>vela init</code>; Vela writes a documented <code>vela.js</code> and guides permissions only when they are needed.</p></div><pre class="code"><span class="comment">// ~/.config/vela/vela.js</span>
<span class="fn">Vela.configure</span>({
  clipboard: { limit: 200 },
});

<span class="fn">Vela.hotkey</span>(<span class="str">"command+shift+space"</span>,
  Vela.showLauncher);
<span class="fn">Vela.hotkey</span>(<span class="str">"option+tab"</span>,
  Vela.showSwitcher);
<span class="fn">Vela.hotkey</span>(<span class="str">"command+option+left"</span>,
  () =&gt; Vela.window(<span class="str">"leftHalf"</span>));

<span class="fn">Vela.command</span>({
  id: <span class="str">"open-workspace"</span>,
  title: <span class="str">"Open workspace"</span>,
  run: () =&gt; Vela.shell(<span class="str">"open ~/workspace"</span>),
});</pre></div></section>
    <section class="section" id="privacy"><div class="shell"><h2>Your control surface should not become someone else’s data surface.</h2><div class="privacy"><p><strong>No account. No telemetry.</strong>Vela does not require a sign-up, and it does not include analytics or advertising SDKs.</p><p><strong>Private by design.</strong>Configuration remains on your Mac. Context snippets use Apple’s on-device model only; secure text fields are excluded.</p></div></div></section>
    <section class="closing"><div class="shell"><h2>Set the shortcut.<br>Make it yours.</h2><div class="actions" style="justify-content:center"><a class="button" href="${downloadURL}">Download DMG</a></div></div></section>
  </main>
  <footer class="shell"><span>Vela is a native macOS utility.</span></footer>
</body></html>`;

export default {
  fetch(): Response {
    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "x-frame-options": "DENY",
      },
    });
  },
} satisfies ExportedHandler;
