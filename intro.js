/* ══════════════════════════════════════════════════════════════════════
   Intro — plays when the home page is opened fresh or refreshed
   (skipped when arriving from another page of the site; see index.html).
   A field of grains drifts in the dark, line 1 sharpens word by word,
   light rolls in and the scene turns paper-white, line 2 appears, then a
   soft breeze lifts the grains away like mist and the page comes into focus.

   • Force it to play:              index.html?intro=1
   • Freeze one moment (debugging): index.html?intro=1&introT=4.2
   • Edit the words: LINE1 / LINE2 below.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('intro-pending')) return;

  var LINE1 = 'This is a space created to show myself.';
  var LINE2 = 'Welcome, to my portfolio';
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

  // Timeline (seconds)
  var T = {
    fade:   [0.0, 1.2],
    l1:     { in: 0.6, out: 2.5 },
    light:  [2.55, 4.35],   // light rolls in over the dunes
    l2:     { in: 3.45, out: 5.0 },
    clear:  [4.85, 6.6],    // a breeze lifts the grains away as they fade
    white:  [5.1, 6.3],
    reveal: 6.0,
    out:    [6.1, 7.0]
  };
  var END = 7.1;

  var params = new URLSearchParams(location.search);
  var FREEZE = params.has('introT') ? parseFloat(params.get('introT')) : null;
  var isSmall = Math.min(innerWidth, innerHeight) < 700 || innerWidth < 900;
  var COUNT = isSmall ? 125000 : 210000;

  // ── DOM ───────────────────────────────────────────────────────────────
  var root = document.getElementById('intro');
  if (!root) { root = document.createElement('div'); root.id = 'intro'; document.body.prepend(root); }
  root.classList.add('on');
  root.setAttribute('aria-hidden', 'true');
  var canvas = document.createElement('canvas');
  root.appendChild(canvas);
  function makeLine(text, cls) {
    var p = document.createElement('p');
    p.className = 'intro-line ' + cls;
    text.split(' ').forEach(function (word, i, arr) {
      var s = document.createElement('span'); s.className = 'w'; s.textContent = word;
      p.appendChild(s);
      if (i < arr.length - 1) p.appendChild(document.createTextNode(' '));
    });
    root.appendChild(p);
    return [].slice.call(p.querySelectorAll('.w'));
  }
  var words1 = makeLine(LINE1, 'l1');
  var words2 = makeLine(LINE2, 'l2');
  var skipBtn = document.createElement('button');
  skipBtn.type = 'button'; skipBtn.className = 'intro-skip'; skipBtn.textContent = 'Skip intro';
  skipBtn.removeAttribute('aria-hidden');
  root.appendChild(skipBtn);
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  scrollTo(0, 0);

  // ── helpers ───────────────────────────────────────────────────────────
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function prog(t, a, b) { return clamp01((t - a) / (b - a)); }
  function easeInOut(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function easeOut(x) { return 1 - Math.pow(1 - x, 3); }
  function mix(a, b, k) { return a + (b - a) * k; }

  var revealed = false, finished = false, skipAt = null, renderer = null, raf = 0;

  function reveal() {
    if (revealed) return;
    revealed = true;
    var img = document.querySelector('.hero-image');
    if (img) img.classList.add('visible');
    html.classList.remove('intro-pending');
    html.classList.add('intro-reveal');
    scrollTo(0, 0);
  }
  function finish() {
    if (finished) return;
    finished = true;
    reveal();
    cancelAnimationFrame(raf);
    if (renderer) { try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) {} }
    root.remove();
    setTimeout(function () { html.classList.remove('intro-reveal'); }, 1600);
  }
  function bail() {               // anything went wrong → just show the site
    reveal();
    root.style.transition = 'opacity .5s ease';
    root.style.opacity = '0';
    setTimeout(finish, 520);
  }
  function skip() {               // timed fade, independent of frame rate
    if (skipAt !== null || finished) return;
    skipAt = 0;
    reveal();
    root.style.transition = 'opacity .6s ease';
    root.style.opacity = '0';
    setTimeout(finish, 650);
  }
  skipBtn.addEventListener('click', skip);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip(); });
  addEventListener('wheel', skip, { passive: true });

  var t0 = null;   // starts on the first rendered frame, so a slow download never eats the opening
  function clock() { if (FREEZE !== null) return FREEZE; if (t0 === null) t0 = performance.now(); return (performance.now() - t0) / 1000; }

  // ── shaders ───────────────────────────────────────────────────────────
  var NOISE = [
    'vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}',
    'float snoise(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
    'vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);',
    'vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);',
    'vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));',
    'vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;',
    'vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;',
    'm*=1.79284291400159-0.85373472095314*(a0*a0+h*h);',
    'vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);}',
    'float ridge(vec2 p){float n=1.0-abs(snoise(p));return n*n;}'
  ].join('\n');

  // Shared: how far the light wave has reached at a given screen point.
  var LIGHT = [
    'uniform float uLight, uAspect;',
    'float lightAt(vec2 ndc){',
    '  float x = ndc.x * uAspect;',
    '  float r = (1.0 - ndc.y) * 0.5 + snoise(vec2(x * 0.55, 1.7)) * 0.07 + snoise(vec2(x * 1.3, ndc.y * 0.8 + 4.0)) * 0.025;',
    '  float front = uLight * 1.9 - 0.45;',
    '  return 1.0 - smoothstep(front - 0.38, front + 0.38, r);',
    '}'
  ].join('\n');

  var VERT = NOISE + '\n' + LIGHT + '\n' + [
    'attribute vec3 aGrid;   // x, z, random',
    'uniform float uTime, uClear, uDpr, uFocus;',
    'varying float vAlpha; varying float vSoft; varying vec3 vColor;',
    'void main(){',
    '  float rnd = aGrid.z;',
    '  float haze = step(0.88, position.x);          // ~12% of grains are soft mist',
    '  vec2 q = aGrid.xy * vec2(0.20, 0.26) + vec2(uTime * 0.010, uTime * 0.040);',
    '  float s1 = snoise(q) * 0.5 + 0.5; float s2 = snoise(q * 0.5 + 3.1) * 0.5 + 0.5;',
    '  float h = smoothstep(0.0, 1.0, s1) * 0.7 + s2 * 0.55 + ridge(q * 1.7 + 7.3) * 0.08;',
    '  float slope = abs(snoise(q + vec2(0.0, 0.08)) - snoise(q - vec2(0.0, 0.08)));',
    '  float crest = clamp(smoothstep(0.62, 1.18, h) * 0.85 + smoothstep(0.05, 0.16, slope) * 0.35, 0.0, 1.0);',
    '  vec3 p = vec3(aGrid.x, h * 1.7 - 1.1 + (rnd - 0.5) * 0.05 + haze * 0.12, aGrid.y);',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  vec4 clip = projectionMatrix * mv;',
    '  float dist = -mv.z;',
    '  vec2 A = clip.xy / max(clip.w, 0.0001);',
    '  float coc = clamp(abs(dist - uFocus) / uFocus, 0.0, 1.4);',
    // grains gather on the crests; dips stay nearly empty
    '  float aT = (0.045 + 1.25 * crest * crest) / (1.0 + coc * coc * 9.0);',
    '  aT *= smoothstep(0.8, 1.8, dist) * (1.0 - smoothstep(9.0, 14.5, dist));',
    '  float sizeT = clamp((1.15 + crest * 0.35 + coc * coc * 6.0) * (5.0 / max(dist, 0.8)), 0.9, 16.0);',
    '  if (haze > 0.5) { aT = 0.05 * crest / (1.0 + coc * 3.0); sizeT = 9.0 + rnd * 16.0; }',
    '  if (mv.z > -0.2) { aT = 0.0; A = vec2(3.0); }',
    // light wave: grains glow as it passes, then turn to graphite on paper
    '  float li = lightAt(A);',
    '  float band = 1.0 - abs(li * 2.0 - 1.0);',
    '  vec3 cT = mix(vec3(0.90, 0.89, 0.87), vec3(0.30, 0.30, 0.29), smoothstep(0.55, 0.92, li));',
    '  aT *= 1.0 + band * 1.6;',
    // clear-out: each grain drifts up and away on the breeze, softening and fading
    '  float d = clamp(0.5 - A.y * 0.5, 0.0, 1.0) * 0.28 + rnd * 0.22;',
    '  float e = smoothstep(0.0, 1.0, clamp((uClear - d) / 0.5, 0.0, 1.0));',
    '  vec2 flow = vec2(snoise(A * 1.2 + 9.0 + uTime * 0.05), snoise(A * 1.2 - 4.0 - uTime * 0.05));',
    '  vec2 ndc = A + (vec2(0.10, 0.22) * (0.5 + rnd) + flow * 0.06) * e;',
    '  gl_Position = vec4(ndc, 0.0, 1.0);',
    '  gl_PointSize = sizeT * (1.0 + e * 1.8) * uDpr;',
    '  vAlpha = aT * pow(1.0 - e, 1.6);',
    '  vSoft = mix(haze > 0.5 ? 1.0 : clamp(coc * 1.2, 0.0, 1.0), 1.0, e);',
    '  vColor = cT;',
    '}'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform float uFade;',
    'varying float vAlpha; varying float vSoft; varying vec3 vColor;',
    'void main(){',
    '  float d = length(gl_PointCoord - 0.5);',
    '  float edge = mix(0.06, 0.5, vSoft);',
    '  float a = 1.0 - smoothstep(0.5 - edge, 0.5, d);',
    '  if (a <= 0.001) discard;',
    '  gl_FragColor = vec4(vColor, vAlpha * a * uFade);',
    '}'
  ].join('\n');

  // Full-screen backdrop: black → (light wave) → warm paper → white.
  var BG_VERT = 'varying vec2 vNdc; void main(){ vNdc = position.xy; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  var BG_FRAG = 'precision highp float;\n' + NOISE + '\n' + LIGHT + '\n' + [
    'uniform float uWhite, uFade;',
    'varying vec2 vNdc;',
    'void main(){',
    '  float li = lightAt(vNdc);',
    '  float glow = (1.0 - abs(li * 2.0 - 1.0)) * 0.05;',
    '  vec3 dark = vec3(0.027);',
    '  vec3 paper = vec3(0.937, 0.929, 0.910);',
    '  vec3 c = mix(dark, paper, li) + glow;',
    '  c = mix(c, vec3(1.0), uWhite);',
    '  c = mix(vec3(0.027), c, max(uFade, li));',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  // ── boot ──────────────────────────────────────────────────────────────
  import(THREE_URL).then(function (THREE) {
    if (!html.classList.contains('intro-pending')) { root.remove(); return; }  // failsafe already fired
    try { start(THREE); } catch (e) { console.warn('[intro]', e); bail(); }
  }).catch(function (e) { console.warn('[intro] three.js failed to load', e); bail(); });

  function start(THREE) {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    var dpr = Math.min(devicePixelRatio || 1, isSmall ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight, false);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 60);

    var grid = new Float32Array(COUNT * 3);
    var pos = new Float32Array(COUNT * 3);
    for (var i = 0; i < COUNT; i++) {
      // 72% in the in-focus middle band, the rest spread near and far
      var z = Math.random() < 0.72 ? mix(1.6, -4.2, Math.random()) : mix(3.4, -10.5, Math.pow(Math.random(), 0.85));
      // narrow screens see less of the field sideways — keep the grains where they're visible
      var spread = (3.4 + (4.0 - z) * 0.55) * Math.max(0.32, Math.min(1, innerWidth / innerHeight / 1.6));
      grid[i * 3] = (Math.random() * 2 - 1) * spread;
      grid[i * 3 + 1] = z;
      grid[i * 3 + 2] = Math.random();
      pos[i * 3] = Math.random();                                     // haze flag
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aGrid', new THREE.BufferAttribute(grid, 3));

    var uniforms = {
      uTime: { value: 0 }, uLight: { value: 0 }, uAspect: { value: innerWidth / innerHeight }, uClear: { value: 0 },
      uFade: { value: 0 }, uDpr: { value: dpr }, uFocus: { value: 4.6 }
    };
    var mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, uniforms: uniforms,
      transparent: true, depthTest: false, depthWrite: false, blending: THREE.NormalBlending
    });
    var points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.renderOrder = 1;
    var bgUniforms = { uLight: uniforms.uLight, uAspect: uniforms.uAspect, uWhite: { value: 0 }, uFade: uniforms.uFade };
    var backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: BG_VERT, fragmentShader: BG_FRAG, uniforms: bgUniforms, depthTest: false, depthWrite: false }));
    backdrop.frustumCulled = false;
    backdrop.renderOrder = 0;
    scene.add(backdrop);
    scene.add(points);


    addEventListener('resize', function () {
      if (finished) return;
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); uniforms.uAspect.value = camera.aspect;
    });

    function words(list, t, tin, tout) {
      for (var i = 0; i < list.length; i++) {
        var k = easeOut(prog(t, tin + i * 0.1, tin + i * 0.1 + 0.85));
        var o = easeInOut(prog(t, tout + i * 0.025, tout + i * 0.025 + 0.6));
        var vis = k * (1 - o);
        list[i].style.opacity = vis.toFixed(3);
        list[i].style.filter = 'blur(' + ((1 - k) * 10 + o * 12).toFixed(2) + 'px)';
      }
    }

    function frame() {
      var t = clock();
      var light = prog(t, T.light[0], T.light[1]);
      light = light * light * (3 - 2 * light);
      var clear = prog(t, T.clear[0], T.clear[1]);
      uniforms.uTime.value = t;
      uniforms.uFade.value = easeOut(prog(t, T.fade[0], T.fade[1]));
      uniforms.uLight.value = light;
      uniforms.uClear.value = clear;
      bgUniforms.uWhite.value = easeInOut(prog(t, T.white[0], T.white[1]));

      // one unbroken glide over the field, easing off as the grains clear
      var glide = t - Math.max(0, t - T.clear[0]) * 0.4;
      camera.position.set(Math.sin(glide * 0.22) * 0.3, 2.35 - glide * 0.03, 4.6 - glide * 0.11);
      camera.lookAt(camera.position.x * 0.4, -0.9, -1.6);

      renderer.render(scene, camera);

      words(words1, t, T.l1.in, T.l1.out);
      words(words2, t, T.l2.in, T.l2.out);
      skipBtn.dataset.tone = light > 0.45 ? 'dark' : 'light';
      skipBtn.style.opacity = (1 - prog(t, T.clear[0], T.clear[0] + 0.6)).toFixed(3);

      if (skipAt === null) {
        if (t >= T.reveal) reveal();
        root.style.opacity = (1 - easeInOut(prog(t, T.out[0], T.out[1]))).toFixed(3);
      }
      window.__introReady = true;

      if (finished) return;
      if (skipAt === null && t >= END && FREEZE === null) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    frame();
  }
})();
