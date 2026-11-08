/* =====================================================================
   methodica-math-percent-07 — unit script.
   Screens 0-15 cover deck slides 3-18 (component methodica-math-percent-07-01).
   Static screens live in index.html; the guided-instruction flow (slides
   7-15) and the drag-and-drop (slide 16) are generated here; the applet
   question (slide 17) comes from js/questions.js via quiz-engine.js.
   ===================================================================== */

'use strict';

const TOTAL_SCREENS = 67;


/* =====================================================================
   Screen 0 — deck slide 3 · hook. Ungraded: the answer is deck slide 4.
   ===================================================================== */
function hookAnswer(el) {
  document.querySelectorAll('#s0 .scq-opt').forEach(o => {
    o.classList.toggle('selected', o === el);
    o.setAttribute('aria-checked', o === el ? 'true' : 'false');
  });
  document.getElementById('s0-continue').disabled = false;
}


/* =====================================================================
   Screens 4-12 — deck slides 7-15 · Guided Instruction
   The approved GuidedInstructionFlow component (proportion-02-01 screen 13,
   QA closed 07.09.26): story frame in the right column, purple step card on
   the left carrying the step text and the answer pills.

   The story frame is identical on all nine deck slides, so it is written
   once here rather than nine times.
   ===================================================================== */

/* FLAG-PRODUCER: deck slides 10-12 blank the first story line (its runs are
   emptied to a single space) while 7-9 and 13-15 carry it. Treated as an
   authoring slip and kept on every step — the story does not change. */
const G_STORY = `دخلتم إلى متجر الملابس المفضل لديكم.<br>على اللافتة عند المدخل مكتوب:`;

/* Producer 08.09: the deck's sign artwork is a low-res crop out of a photo —
   rebuild it. This is the same object drawn as vector: a hanging board on two
   chains, brushed-metal frame, coloured panel with a white inset keyline, the
   percentage over the word הנחה. One builder, two colourways. */
function discountSign(pct, panel, panelDark) {
  /* Deliberately no <defs>/gradients: nine copies of this screen live in the
     DOM at once, and duplicate gradient ids inside display:none sections stop
     resolving in Chrome — the later signs painted as empty white boxes. Flat
     fills plus two shading strips give the same read with nothing to collide. */
  return `<svg class="sign-svg" viewBox="0 0 300 168" role="img" aria-label="لافتة معلّقة: خصم ${pct}%">
    <g fill="none" stroke="#8F8F8F" stroke-width="2.6">
      <ellipse cx="34"  cy="4"  rx="4.2" ry="6.5"/><ellipse cx="34"  cy="15" rx="4.2" ry="6.5"/><ellipse cx="34"  cy="26" rx="4.2" ry="6.5"/>
      <ellipse cx="266" cy="4"  rx="4.2" ry="6.5"/><ellipse cx="266" cy="15" rx="4.2" ry="6.5"/><ellipse cx="266" cy="26" rx="4.2" ry="6.5"/>
    </g>
    <rect x="8" y="30" width="284" height="130" rx="7" fill="#EDEDED" stroke="#9E9E9E" stroke-width="1.5"/>
    <rect x="9.5" y="31.5" width="281" height="5" fill="#FBFBFB"/>
    <rect x="9.5" y="152" width="281" height="6.5" fill="#C9C9C9"/>
    <rect x="17" y="39" width="266" height="112" rx="4" fill="${panel}"/>
    <rect x="17" y="39" width="266" height="7" fill="${panelDark}" opacity="0.45"/>
    <rect x="23" y="45" width="254" height="100" rx="2" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.92"/>
    <circle cx="34" cy="39" r="5.5" fill="none" stroke="#8C8C8C" stroke-width="2.5"/>
    <circle cx="266" cy="39" r="5.5" fill="none" stroke="#8C8C8C" stroke-width="2.5"/>
    <text class="sign-pct"  x="150" y="97" text-anchor="middle" fill="#FFFFFF">${pct}%</text>
    <text class="sign-word" x="150" y="130" text-anchor="middle" fill="#FFFFFF">خصم</text>
  </svg>`;
}

/* RTL: first child renders rightmost. The 20% sign is at x=909 in the deck
   (right), the 10% sign at x=478 (left) — so 20% comes first. */
/* Producer 08.09: the deck's sign artwork is a low-res crop out of a photo —
   rebuild it. This is the same object drawn as vector: a hanging board on two
   chains, brushed-metal frame, coloured panel with a white inset keyline, the
   percentage over the word הנחה. One builder, two colourways. */
/* RTL: first child renders rightmost. The 20% sign is at x=909 in the deck
   (right), the 10% sign at x=478 (left) — so 20% comes first. */
/* RTL: first child renders rightmost. The 20% sign is at x=909 in the deck
   (right), the 10% sign at x=478 (left) — so 20% comes first. */
const G_SIGNS = `
  <div class="signs-row">
    <figure class="sign-card">
      ${discountSign(20, '#4E6B8E', '#3A5273')}
      <figcaption><strong>عرض اليوم: خصم 20%<br>على جميع المنتجات في المتجر!</strong></figcaption>
    </figure>
    <figure class="sign-card">
      ${discountSign(10, '#557338', '#43602C')}
      <figcaption><strong>لعضوات النادي وأعضائه<br>خصم <span class="g-accent">إضافي</span> بنسبة 10%</strong></figcaption>
    </figure>
  </div>`;

const G_PRICE = `سعر البنطلون الذي أعجبكم هو 150 شيكلًا.`;
/* deck slide 8 drops "לחברי מועדון" from this line; every other step keeps it */
const G_ASK        = `هل يقدّم المتجر لأعضاء النادي خصمًا بنسبة 30% من السعر الأصلي؟`;
const G_ASK_NOCLUB = `هل يقدم المتجر خصمًا بنسبة 30% من السعر الأصلي؟`;

const G_TITLE = 'تخفيض (خصم) مزدوج';

const GUIDED = [
  {
    /* deck slide 7 — set-up, no question. Bold instruction across the top,
       jeans hero in the middle, companion + bubble bottom-left. */
    screen: 4, noStep: true,
    /* QA 02.11.26: jeans hero removed (producer) */
    intro: `تأمّلوا التمرين التالي. لا تحلّوه، فقط انظروا إلى المعطيات وفكّروا: هل لديكم اتجاه للحل؟`,
    bubble: `سنشرح طريقة الحساب فورًا، خطوة بخطوة`,
  },
  {
    /* deck slide 8 — Q1. Answer: 150 ₪ · 0.8  (150 × 0.8 = 120) */
    screen: 5, ask: G_ASK_NOCLUB, intro: `تأمّلوا التمرين التالي. لا تحلّوه، فقط انظروا إلى المعطيات وفكّروا: هل لديكم اتجاه للحل؟`,
    card: `<p>سنحسب سعر البنطلون النهائي على مرحلتين.</p>
           <p>في المرحلة الأولى، سنحسب سعر البنطلون بعد الخصم الأول بنسبة 20%.</p>`,
    cardQ: `ما هو الحساب الصحيح؟`,
    q: { opts: ['150 ₪ · 0.8', '150 ₪ · 0.2', '30 ₪ · 0.8'], correct: 0 },
  },
  {
    /* deck slide 9 — Q2. Answer: 120 ש"ח */
    screen: 6,
    card: `<p>وفقًا للعرض، نحصل على خصم 20% على جميع المنتجات في المتجر، لذلك يكون السعر الجديد 80% من السعر الأصلي.</p>`,
    cardQ: `ما هو سعر البنطلون بعد هذا الخصم؟`,
    q: { opts: ['100 شيكل', '30 شيكل', '120 شيكل'], correct: 2 },
  },
  {
    /* deck slide 10 — Q3. Answer: 90%.
       Partial bold: only `"המחיר החדש` is b="1"; the closing `". ` is not. */
    screen: 7,
    /* QA 14.10.26: no gap between the first two lines (one paragraph), and
       "ישלמו" opens its own line so the blank reads as the thing to complete. */
    card: `<p>120 ₪ هو السعر بعد خصم العرض، ولنسمِّه <strong>"السعر الجديد"</strong>.<br>ننتقل الآن إلى الخصم الثاني:</p>
           <p>يحصل أعضاء النادي على خصم إضافي بنسبة 10%، ولذلك<br>سيدفعون ____ من السعر الجديد (120 ₪).</p>`,
    cardQ: `ما هي القيمة الناقصة في الجملة؟`,
    q: { opts: ['70%', '80%', '90%'], correct: 2 },
  },
  {
    /* deck slide 11 — Q4. Answer: 120 ש"ח */
    screen: 8,
    cardQ: `من أي مبلغ ("السعر الجديد") علينا أن نحسب الخصم الإضافي؟`,
    q: { opts: ['150 شيكل', '120 شيكل', '105 شيكل'], correct: 1 },
  },
  {
    /* deck slide 12 — Q5. Answer: 120 · 0.9 */
    screen: 9,
    cardQ: `كيف نحسب؟`,
    q: { opts: ['150 · 0.9', '120 · 0.9', '120 · 0.1'], correct: 1 },
  },
  {
    /* deck slide 13 — Q6. Answer: 108 ש"ח */
    screen: 10,
    cardQ: `إذن، ما هو سعر البنطلون لأعضاء النادي؟`,
    q: { opts: ['105 شيكل', '135 شيكل', '108 شيكل'], correct: 2 },
  },
  {
    /* deck slide 14 — Q7. Answer: 150 · 0.7 */
    screen: 11,
    card: `<p>السعر الذي دفعناه بعد الخصمين هو 108 ₪.</p>
           <p>هل هو مطابق لسعر البنطلون بعد خصم 30% من السعر الأصلي؟</p>
           <p>هيا نتحقق:</p>
           <p>سعر البنطلون بعد خصم 30% من السعر الأصلي هو:</p>`,
    q: { opts: ['150 · 0.7', '120 · 0.7', '150 · 0.3'], correct: 0 },
  },
];

const guidedState = {};

/* the plain-bulb icon the approved step card carries in its top corner */
const GC_BULB = `<svg class="gc-bulb" viewBox="0 0 20.997 27.9988" fill="none" aria-hidden="true">
  <path d="M17.4818 2.65764C15.2512 0.668476 12.2563 -0.275357 9.25683 0.0699765C4.59833 0.60431 0.748334 4.35748 0.103168 8.99148C-0.387999 12.5078 0.894168 16.0031 3.532 18.34C4.99267 19.6338 5.83033 21.5191 5.83033 23.5095V23.9155C5.83033 26.1671 7.662 27.9988 9.91367 27.9988H11.0803C13.332 27.9988 15.1637 26.1671 15.1637 23.9155V23.5095C15.1637 21.5308 16.0072 19.6321 17.4877 18.3143C19.6108 16.4243 20.9968 13.6885 20.9968 10.6666C20.9968 7.51914 19.6435 4.58398 17.4818 2.65764ZM13.9968 23.9155C13.9968 25.5236 12.6885 26.8319 11.0803 26.8319H9.91367C8.3055 26.8319 6.99717 25.5236 6.99717 23.9155V23.6666H13.9968V23.9155ZM16.7117 17.4441C15.1252 18.8546 14.1655 20.7801 13.9968 22.4996H12.2503V15.4996C12.2503 15.1776 11.9888 14.9161 11.6668 14.9161C11.3448 14.9161 11.0833 15.1776 11.0833 15.4996V22.4996H9.91367V15.4996C9.91367 15.1776 9.65217 14.9161 9.33017 14.9161C9.00817 14.9161 8.74667 15.1776 8.74667 15.4996V22.4996H6.99717C6.83433 20.7906 5.87233 18.8686 4.30667 17.4791C1.97967 15.4166 0.850168 12.3373 1.28217 9.15181C1.85183 4.95064 5.32617 1.68881 9.34733 1.23231C11.9958 0.928476 14.6432 1.76381 16.6118 3.51864C18.5233 5.22314 19.8298 7.81948 19.8298 10.6666C19.8298 13.3348 18.5967 15.7626 16.7117 17.4441Z" fill="currentColor"/>
</svg>`;

function buildGuidedScreens() {
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  GUIDED.forEach((cfg) => {
    if (!inPart(cfg.screen)) return;
    guidedState[cfg.screen] = { done: false, selected: null };
    const sec = document.createElement('section');
    sec.className = 'screen g-screen';
    sec.dataset.screen = cfg.screen;
    sec.id = `g${cfg.screen}`;

    const opts = cfg.q ? `<div class="gc-opts" role="radiogroup" aria-label="خيارات الإجابة">
      ${cfg.q.opts.map((o, i) => `
        <div class="gc-opt" role="radio" aria-checked="false" tabindex="0" data-idx="${i}"
             onclick="guidedAnswer(${cfg.screen}, this)"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();guidedAnswer(${cfg.screen}, this);}">${o}</div>`).join('')}
    </div>` : '';

    sec.innerHTML = `
      <h1 class="g-title g-title--center" data-reveal="1">${G_TITLE}</h1>
      ${cfg.intro ? `<p class="g-intro" data-reveal="1">${cfg.intro}</p>` : ''}
      <div class="g-layout${cfg.intro ? ' g-layout--low' : ''}${cfg.hero ? ' g-layout--hero' : ''}${cfg.noStep ? ' g-layout--nostep' : ''}">
        <div class="g-right" data-reveal="2">
          <div class="g-frame">
            <div class="g-story">${G_STORY}</div>
            ${G_SIGNS}
            <div class="g-price">${G_PRICE}</div>
            <div class="g-qline">${cfg.ask || G_ASK}</div>
          </div>
        </div>
        ${cfg.hero ? `<div class="g-hero-slot" data-reveal="3">${cfg.hero}</div>` : ''}
        ${cfg.noStep ? '' : `<aside class="g-callout${cfg.wideCard ? ' g-callout--wide' : ''}" data-reveal="4" aria-label="تعليمات المرحلة">
          ${GC_BULB}
          ${cfg.card ? `<div class="gc-text">${cfg.card}</div>` : ''}
          ${cfg.cardQ ? `<div class="gc-q">${cfg.cardQ}</div>` : ''}
          ${opts}
        </aside>`}
      </div>
      ${cfg.bubble ? `<div data-reveal="1" data-reveal-fade class="character-widget cw-guided">
          <div class="speech-bubble">${cfg.bubble}</div>
          ${cfg.bubbleClip
            ? `<video src="${cfg.bubbleClip}" autoplay loop muted playsinline preload="auto" aria-label="الشخصية المرافقة تفكر"></video>`
            : `<img src="assets/img/character-1.png" alt="شخصية مرافقة">`}
        </div>` : ''}
      ${cfg.q
        ? `<button class="btn-continue" id="g${cfg.screen}-check" disabled onclick="goTo(${cfg.screen + 1})">متابعة؟</button>`
        : `<button class="btn-continue" onclick="goTo(${cfg.screen + 1})">متابعة</button>`}
      <button class="btn-back" onclick="goTo(${cfg.screen - 1})">رجوع</button>`;
    app.insertBefore(sec, backRef);
  });
}

/* QA 11.10.26 — GuidedInstructionFlow-RevealCallout (percent-08, the project
   default): the answer reveals ON THE CLICK, there is no צדקתי step, and a
   wrong pick gets NO ✗ — only the correct option is marked ✓; the learner's
   own pick keeps the lavender .chosen wash. The bar button unlocks as שנמשיך?. */
function guidedAnswer(screen, el) {
  const st = guidedState[screen];
  if (st.done) return;
  st.done = true;
  st.selected = Number(el.dataset.idx);
  const cfg = GUIDED.find(g => g.screen === screen);
  document.querySelectorAll(`#g${screen} .gc-opt`).forEach(o => {
    const idx = Number(o.dataset.idx);
    o.classList.add('locked');
    o.classList.remove('selected');
    o.setAttribute('aria-checked', o === el ? 'true' : 'false');
    if (idx === cfg.q.correct) o.classList.add('correct');
    else if (idx === st.selected) o.classList.add('chosen');
  });
  document.getElementById(`g${screen}-check`).disabled = false;
}


/* =====================================================================
   Screen 12 — deck slide 15 (v5, 22.10.26) · HookClosing-01-Text
   QA 02.11.26: the old guided conclusion card is replaced by the deck's new
   "لنلخّص" slide - centred title, the two prices in the standard
   .car-table (DataTable, Figma 716:24165), conclusion centred under it.
   The note asks for a staged reveal (table, then conclusion); built all at
   once per the standing no-gradual-reveal rule.
   ===================================================================== */
function buildSummaryScreen() {
  if (!inPart(12)) return;
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  const sec = document.createElement('section');
  sec.className = 'screen sum12-screen';
  sec.dataset.screen = 12;
  sec.id = 's12';
  sec.innerHTML = `
    <div class="sum12" data-reveal="1">
      <h1 class="sum12-title">لنلخّص</h1>
      <table class="car-table car-table--text sum12-table">
        <thead><tr><th>الخصم</th><th>السعر النهائي</th></tr></thead>
        <tbody>
          <tr><td>30% من السعر الأصلي (150 شيكلًا)</td><td>105 شيكل</td></tr>
          <tr><td>خصم أول بنسبة 20% (من 150 شيكلًا)<br>خصم ثانٍ بنسبة 10% (من الكل الجديد، وهو 120 شيكلًا)</td><td>108 شيكل</td></tr>
        </tbody>
      </table>
      <p class="sum12-text"><strong>الاستنتاج</strong> - حصلنا على أسعار مختلفة، إذن جمع نسب الخصم غير صحيح.</p>
      <p class="sum12-text"><strong>يجب حساب السعر بعد الخصم على مرحلتين</strong>!<br> في كل مرة نحسب النسبة المئوية من الكل المناسب<br> (خصم 20% من السعر الأصلي، وخصم 10% من السعر بعد الخصم الأول).</p>
    </div>
    <button class="btn-continue" onclick="goTo(13)">متابعة</button>
    <button class="btn-back" onclick="goTo(11)">رجوع</button>`;
  app.insertBefore(sec, backRef);
}


/* =====================================================================
   Screen 13 — deck slide 16 · TextOnlyDragAndDropQuestion
   Note: "התשובות מסודרות. יש לערבלן." — the deck shows every definition
   already in its own row, so the row pairing IS the key; the chips ship
   shuffled and the drop zones start empty.
   On-canvas copy states the rules: 2 attempts, no hint.
   ===================================================================== */

const DND_ROWS = [
  { id: 'orig',  label: 'الكل الأصلي', def: 'الكل الذي نبدأ منه قبل أي تغيير بالنسب المئوية. وهو الأساس لحساب قيمة النسبة المئوية في المرة الأولى.' },
  { id: 'new',   label: 'الكل الجديد',  def: 'الكل الناتج بعد حساب قيمة النسبة المئوية للمرة الأولى، ويصبح أساسًا لحساب قيمة النسبة المئوية للمرة الثانية.' },
  { id: 'final', label: 'الكل النهائي', def: 'الكل الناتج في نهاية العملية، بعد تنفيذ العمليتين الواحدة تلو الأخرى.' },
];
/* fixed shuffle — a deterministic order keeps QA screenshots comparable */
const DND_POOL_ORDER = ['new', 'final', 'orig'];

const dndState = { attempts: 0, done: false, picked: null, placed: {} };

function buildDragDropScreen() {
  if (!inPart(13)) return;
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  const sec = document.createElement('section');
  sec.className = 'screen dnd-screen';
  sec.dataset.screen = 13;
  sec.id = 'q13';
  sec.innerHTML = `
    <h1 class="dnd-title" data-reveal="1">ماذا تعلمنا؟</h1>
    <div class="dnd-intro" data-reveal="1">
      <p>في التخفيض المزدوج تعرّفنا إلى ثلاثة أنواع من الكل: الكل الأصلي، والكل الجديد، والكل النهائي.<br>سترافقنا هذه الأنواع طوال الوحدة.</p>
      <p><strong class="dnd-ask">اسحبوا كل تعريف إلى الكل المناسب.</strong></p>
    </div>

    <div class="dnd-rows" data-reveal="2">
      ${DND_ROWS.map(r => `
        <div class="dnd-row" data-row="${r.id}">
          <span class="dnd-label">${r.label}</span>
          <div class="dnd-zone" data-zone="${r.id}" role="button" tabindex="0"
               aria-label="منطقة السحب لـ ${r.label}"
               ondragover="event.preventDefault()" ondrop="dndDrop(event, '${r.id}')"
               onclick="dndPlace('${r.id}')"
               onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();dndPlace('${r.id}');}"><span class="dnd-zone-hint">منطقة السحب</span></div>
        </div>`).join('')}
    </div>

    <div class="dnd-pool" data-reveal="3" aria-label="تعريفات للسحب">
      ${DND_POOL_ORDER.map(id => {
        const r = DND_ROWS.find(x => x.id === id);
        return `<div class="dnd-chip" draggable="true" data-chip="${r.id}" tabindex="0"
             ondragstart="dndDragStart(event, '${r.id}')"
             onclick="dndPick('${r.id}')"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();dndPick('${r.id}');}">${r.def}</div>`;
      }).join('')}
    </div>

    <div class="quiz-feedbox" id="q13-feedbox"></div>
    <button class="btn-continue" id="q13-check" disabled onclick="dndCheck()">هل إجابتي صحيحة؟</button>
    <button class="btn-back" onclick="goTo(12)">رجوع</button>`;
  app.insertBefore(sec, backRef);
}

function dndChip(id) { return document.querySelector(`#q13 .dnd-chip[data-chip="${id}"]`); }
function dndZone(id) { return document.querySelector(`#q13 .dnd-zone[data-zone="${id}"]`); }

function dndDragStart(ev, id) {
  if (dndState.done) return;
  dndState.picked = id;
  ev.dataTransfer.setData('text/plain', id);
  ev.dataTransfer.effectAllowed = 'move';
}
function dndDrop(ev, zone) {
  ev.preventDefault();
  dndMove(ev.dataTransfer.getData('text/plain') || dndState.picked, zone);
}
function dndPick(id) {
  if (dndState.done) return;
  /* same gesture as the slide-32 table: pressing a definition that is already
     in a drop zone returns it to the pool. */
  const placed = Object.values(dndState.placed).includes(id);
  if (placed) { dndMove(id, null); return; }
  dndState.picked = dndState.picked === id ? null : id;
  document.querySelectorAll('#q13 .dnd-chip').forEach(c =>
    c.classList.toggle('picked', c.dataset.chip === dndState.picked));
}
function dndPlace(zone) {
  if (dndState.picked) dndMove(dndState.picked, zone);
  else if (dndState.placed[zone]) dndMove(dndState.placed[zone], null); // click a filled zone to take it back
}

function dndMove(chipId, zone) {
  if (dndState.done || !chipId) return;
  const chip = dndChip(chipId);
  if (!chip) return;
  // free whichever zone already held this chip
  Object.keys(dndState.placed).forEach(z => { if (dndState.placed[z] === chipId) delete dndState.placed[z]; });
  if (zone) {
    // a zone holds one chip — bump the previous occupant back to the pool
    const prev = dndState.placed[zone];
    if (prev && prev !== chipId) dndChip(prev) && document.querySelector('#q13 .dnd-pool').appendChild(dndChip(prev));
    dndState.placed[zone] = chipId;
    dndZone(zone).appendChild(chip);
  } else {
    document.querySelector('#q13 .dnd-pool').appendChild(chip);
  }
  dndState.picked = null;
  document.querySelectorAll('#q13 .dnd-chip').forEach(c => c.classList.remove('picked', 'wrong'));
  document.querySelectorAll('#q13 .dnd-zone').forEach(z =>
    z.classList.toggle('is-filled', !!dndState.placed[z.dataset.zone]));
  dndHideFeedback();
  document.getElementById('q13-check').disabled = Object.keys(dndState.placed).length !== DND_ROWS.length;
}

function dndHideFeedback() {
  const box = document.getElementById('q13-feedbox');
  box.className = 'quiz-feedbox';
  box.innerHTML = '';
}
function dndShowFeedback(kind, title, body) {
  const box = document.getElementById('q13-feedbox');
  box.className = `quiz-feedbox ${kind === 'correct' ? 'is-correct' : 'is-wrong'}`;
  box.style.transform = '';
  quizFeedboxDrag(box);
  /* QA 14.10.26 (this screen only): the title's second line is regular weight */
  const t = title.replace(/<br>([\s\S]*)$/, '<br><span class="fb-title-line2">$1</span>');
  box.innerHTML = `<div class="scq-fb-title">${t}</div>${body ? `<div class="fb-body">${body}</div>` : ''}`;
}

function dndCheck() {
  if (dndState.done) { goTo(14); return; }
  dndState.attempts += 1;
  const allRight = DND_ROWS.every(r => dndState.placed[r.id] === r.id);

  if (allRight) {
    dndFinish(true);
    dndShowFeedback('correct', 'أحسنتم!<br>الإجابة صحيحة.', '');
    return;
  }
  if (dndState.attempts >= 2) {
    // reveal the key: every chip goes to its own row
    const user = { ...dndState.placed };
    const anyRight = DND_ROWS.some(r => user[r.id] === r.id);
    DND_ROWS.forEach(r => {
      const chip = dndChip(r.id);
      dndZone(r.id).appendChild(chip);
      dndState.placed[r.id] = r.id;
      dndZone(r.id).classList.add('is-filled');
    });
    dndFinish(false);
    /* QA 02.11.26: red feedback is the title only (no "בואו נמשיך לתרגל"),
       so the title loses its "בואו נבין למה:" lead-in too */
    dndShowFeedback('wrong', anyRight ? FB_PARTIAL_TITLE_SHORT : FB_WRONG_TITLE_SHORT, '');
    dndAddToggle(user);
    return;
  }
  // first wrong attempt — mark the misplaced chips and let the learner retry
  DND_ROWS.forEach(r => {
    if (dndState.placed[r.id] !== r.id) {
      const chip = dndChip(dndState.placed[r.id]);
      if (chip) chip.classList.add('wrong');
    }
  });
  dndShowFeedback('wrong', 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟', '');
  document.getElementById('q13-check').disabled = true;
}

/* QA 18.10.26: the reveal overwrites the learner's placement, so the
   feedback gets the התשובה שלי / התשובה הנכונה toggle (Sept conventions) */
function dndAddToggle(user) {
  const box = document.getElementById('q13-feedbox');
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'fb-answer-toggle'; btn.dataset.mode = 'correct';
  btn.textContent = 'إجابتي';
  btn.onclick = () => {
    const showMine = btn.dataset.mode === 'correct';
    const placed = showMine ? user : Object.fromEntries(DND_ROWS.map(r => [r.id, r.id]));
    DND_ROWS.forEach(r => { const c = placed[r.id] && dndChip(placed[r.id]); if (c) dndZone(r.id).appendChild(c); });
    DND_ROWS.forEach(r => dndChip(r.id).classList.remove('wrong'));
    /* a chip the learner placed in the wrong row is the one marked ✗ */
    DND_ROWS.forEach(r => { if (showMine && user[r.id] && user[r.id] !== r.id) dndChip(user[r.id]).classList.add('wrong'); });
    DND_ROWS.forEach(r => dndZone(r.id).classList.toggle('is-revealed', !showMine));
    btn.dataset.mode = showMine ? 'mine' : 'correct';
    btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
  };
  box.appendChild(btn);
}

function dndFinish(wasCorrect) {
  dndState.done = true;
  dndState.wasCorrect = wasCorrect;
  document.querySelectorAll('#q13 .dnd-chip').forEach(c => {
    c.draggable = false;
    c.classList.remove('picked', 'wrong');
    c.classList.add('locked');
  });
  DND_ROWS.forEach(r => dndZone(r.id).classList.add(wasCorrect ? 'is-correct' : 'is-revealed'));
  const btn = document.getElementById('q13-check');
  btn.textContent = 'متابعة؟';
  btn.disabled = false;
}


/* =====================================================================
   Boot
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  buildGuidedScreens();
  buildSummaryScreen();
  buildDragDropScreen();
  buildMapScreen();
  buildClassTaskScreen();
  /* the two-route table on deck slide 57 comes from the same helper slide 58
     uses, so the two copies cannot drift */
  /* 09.09 — null-guarded for the multi-component split: a component that does
     not carry screen 47 has no #s47-routes, and the bare lookup threw and
     aborted the rest of this handler. Harmless in the single-folder build. */
  const routes = document.getElementById('s47-routes');
  if (routes) routes.innerHTML = ROUTES_TABLE(false);
  /* deck slide 5 places the companion bottom-left with NO speech bubble —
     the character stands alone. Do not add copy the deck does not have. */
  /* QA 14.10.26 dslide 32 — the pizza set-up page is question 3's stem, so it
     carries question 3's stepper */
  const s32 = document.getElementById('s32');
  if (s32) s32.insertAdjacentHTML('afterbegin', quizStepperHTML(S32_STEP));
  const s2w = document.getElementById('s2-widget');
  if (s2w) s2w.innerHTML =
    `<div class="character-widget cw-plain"><img src="assets/img/character-1.png" alt="شخصية مرافقة"></div>`;
});

function resetScreenState(n) {
  if (typeof quizResetScreenState === 'function') quizResetScreenState(n);
  if (n === 16) mapRefresh();
  if (SS[n]) ssEnter(n);
  if (n === 32) quizStepperUpdate(32, S32_STEP);
}
const S32_STEP = { screen: 32, step: p3step(3) };


/* =====================================================================
   dslide 24 scroll set, deck slides 32 + 33 · OrderedDragAndDropQuestion
   QA 02.11.26 (deck v5): the old one-table question is split in two -
     q26 = deck 32, part א: drag the NEW length and width into a 2-column table;
     q27 = deck 33, part ב: the full table - the new length/width come filled
           in from part א, four formulas (perimeter + area) to drag.
   One engine serves both, keyed by screen. Note on both slides: "בהצגת
   התשובות הנכונות דורסות את תשובות התלמיד. יש להוסיף במשובים כפתור 'חזרה
   לתשובה שלי'" - hence the toggle in dtAddMyAnswerToggle().
   ===================================================================== */

/* QA 02.11.26: a space either side of "=" in every formula chip */
const DT_EQ = {
  'perim-orig': '2∙3a+2∙a = 8a',
  'area-orig':  '3a∙a = 3a²',
  'len-new':    '1.4∙3a = 4.2a',
  'wid-new':    '0.6∙a = 0.6a',
  'perim-new':  '2∙4.2a+2∙0.6a = 9.6a',
  'area-new':   '4.2a∙0.6a = 2.52a²',
};
/* slots = the drop zones (each takes the chip of the same id); pool = the
   deck's own bank order (RTL: first = rightmost) */
const DT = {
  26: { slots: ['len-new', 'wid-new'], pool: ['len-new', 'wid-new'] },
  27: { slots: ['perim-orig', 'area-orig', 'perim-new', 'area-new'],
        pool: ['perim-new', 'perim-orig', 'area-orig', 'area-new'] },
};
Object.values(DT).forEach(d => { d.placed = {}; d.picked = null; d.user = null; });

const dtChipHTML = (n, id) =>
  `<div class="dt-chip" draggable="true" data-chip="${id}" tabindex="0" role="button"
        aria-label="صيغة ${DT_EQ[id]}"
        ondragstart="dtDragStart(event, ${n}, '${id}')"
        onclick="dtPick(${n}, '${id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();dtPick(${n}, '${id}');}"><span class="eq-ltr">${DT_EQ[id]}</span></div>`;

const dtZone = (n, id) =>
  `<div class="dt-zone" data-zone="${id}" role="button" tabindex="0" aria-label="منطقة السحب"
        ondragover="event.preventDefault()" ondrop="dtDrop(event, ${n}, '${id}')"
        onclick="dtPlace(${n}, '${id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();dtPlace(${n}, '${id}');}"></div>`;
const dtGiven = (id) => `<span class="dt-given eq-ltr">${DT_EQ[id]}</span>`;

/* RTL table: the FIRST cell in a row renders rightmost, which is where the
   deck puts the row label (tblPr has rtl="1" on both tables). */
const DT_TABLE_A = `
<table class="data-table dt-table dt-table--a">
  <thead><tr>
    <th class="dt-corner"></th>
    <th>طول المستطيل (بالسم)</th>
    <th>عرض المستطيل (بالسم)</th>
  </tr></thead>
  <tbody>
    <tr><th scope="row">المستطيل الأصلي</th><td><span class="eq-ltr">3a</span></td><td><span class="eq-ltr">a</span></td></tr>
    <tr><th scope="row">المستطيل الجديد</th><td>${dtZone(26, 'len-new')}</td><td>${dtZone(26, 'wid-new')}</td></tr>
  </tbody>
</table>`;
const DT_TABLE_B = `
<table class="data-table dt-table">
  <thead><tr>
    <th class="dt-corner"></th>
    <th>طول المستطيل (بالسم)</th>
    <th>عرض المستطيل<br>(بالسم)</th>
    <th>محيط المستطيل<br>(بالسم)</th>
    <th>مساحة المستطيل<br>(بالسم²)</th>
  </tr></thead>
  <tbody>
    <tr>
      <th scope="row">المستطيل الأصلي</th>
      <td><span class="eq-ltr">3a</span></td>
      <td><span class="eq-ltr">a</span></td>
      <td>${dtZone(27, 'perim-orig')}</td>
      <td>${dtZone(27, 'area-orig')}</td>
    </tr>
    <tr>
      <th scope="row">المستطيل الجديد</th>
      <td>${dtGiven('len-new')}</td>
      <td>${dtGiven('wid-new')}</td>
      <td>${dtZone(27, 'perim-new')}</td>
      <td>${dtZone(27, 'area-new')}</td>
    </tr>
  </tbody>
</table>`;

const DT_FB_A = `
  <p>طول المستطيل زِيدَ بنسبة 40%، ولذلك يصبح الطول الجديد<br>140% من الكل الأصلي:</p>
  <p><span class="eq-ltr">1.4 · 3a = 4.2a</span></p>
  <p>خُفِّض عرض المستطيل بنسبة 40%، ولذلك يساوي عرضه الجديد<br>60% من الكل الأصلي:</p>
  <p><span class="eq-ltr">0.6 · a = 0.6a</span></p>`;
const DT_FB_B = `
  <p>ازداد طول المستطيل بنسبة 40%، لذلك سيكون الكل الجديد 140% من الكل الأصلي.</p>
  <p>انخفض عرض المستطيل بنسبة 40%، لذلك سيكون الكل الجديد 60% من الكل الأصلي.</p>`;

const DT_STEM_RECT = `<p>معطى مستطيل طوله <span class="eq-ltr">3a</span> سم وعرضه <span class="eq-ltr">a</span> سم.<br>زيدوا طول المستطيل بنسبة 40% وأنقصوا عرضه بنسبة 40%.</p>`;

const dtQuestion = (n, extra) => Object.assign({
  screen: n, embedIn: 26, type: 'custom', maxAttempts: 2, step: { group: 'p2', index: 4, total: 4 },
  isCorrect: () => DT[n].slots.every(z => DT[n].placed[z] === z),
  anyPartRight: () => DT[n].slots.some(z => DT[n].placed[z] === z),
  markRetry: () => {
    DT[n].slots.forEach(z => {
      const held = DT[n].placed[z];
      if (held && held !== z) dtChipEl(n, held).classList.add('wrong');
    });
  },
  mark: () => dtShowKey(n),
  afterFeedback: (screen, q, isCorrect) => { if (!isCorrect) dtAddMyAnswerToggle(screen); },
}, extra);

/* deck 32 - part א (no hint on the v5 slide) */
QUESTIONS.push(dtQuestion(26, {
  stem: `<p>لنتدرّب على الزيادة والنقصان بالنسبة المئوية من الكل في مجالات أخرى.</p>
    ${DT_STEM_RECT}
    <p>سنجيب عبر مرحلتين:<br><strong>أ.</strong> <strong>وفقًا لنسب التغيير المعطاة، اسحبوا الطول والعرض الجديدين إلى الجدول</strong><br>(وهما الكلّان الجديدان اللذان سنواصل بهما).</p>`,
  html: `${DT_TABLE_A}
    <div class="dt-pool" aria-label="صيغ للسحب">${DT[26].pool.map(id => dtChipHTML(26, id)).join('')}</div>`,
  content: `<div class="character-widget cw-table">
      <div class="speech-bubble">المبادئ لا تتغير!</div>
      <img src="assets/img/character-1-pondering.png" alt="شخصية مرافقة">
    </div>`,
  fb: {
    correct: { title: 'صحيح جدًا.', body: DT_FB_A },
    wrong:   { title: 'غير دقيق. تُعرَض الإجابة الصحيحة.', body: DT_FB_A },
    retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
  },
}));

/* deck 33 - part ב */
QUESTIONS.push(dtQuestion(27, {
  stem: `${DT_STEM_RECT}
    <p><strong>ب. استنادًا إلى إجابات الفقرة أ، أكملوا الجدول:</strong></p>`,
  html: `${DT_TABLE_B}
    <div class="dt-pool" aria-label="صيغ للسحب">${DT[27].pool.map(id => dtChipHTML(27, id)).join('')}</div>`,
  fb: {
    correct: { title: 'صحيح جدًا.<br>الجدول الكامل معروض.', body: DT_FB_B },
    wrong:   { title: 'الإجابة غير صحيحة بالكامل. الجدول الصحيح معروض.', body: DT_FB_B },
    retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
  },
}));

function dtChipEl(n, id) { return document.querySelector(`#q${n} .dt-chip[data-chip="${id}"]`); }
function dtZoneEl(n, id) { return document.querySelector(`#q${n} .dt-zone[data-zone="${id}"]`); }
const dtPool = (n) => document.querySelector(`#q${n} .dt-pool`);

function dtDragStart(ev, n, id) {
  if (quizState[n].done) return;
  DT[n].picked = id;
  ev.dataTransfer.setData('text/plain', id);
  ev.dataTransfer.effectAllowed = 'move';
}
function dtDrop(ev, n, zone) {
  ev.preventDefault();
  dtMove(n, ev.dataTransfer.getData('text/plain') || DT[n].picked, zone);
}
function dtPick(n, id) {
  if (quizState[n].done) return;
  /* producer 08.09: pressing a formula that is already in the table sends it
     straight back to the pool, so a placement can be undone without having to
     find an empty cell first. Pressing one in the pool selects it as before. */
  if (Object.values(DT[n].placed).includes(id)) { dtMove(n, id, null); return; }
  DT[n].picked = DT[n].picked === id ? null : id;
  document.querySelectorAll(`#q${n} .dt-chip`).forEach(c =>
    c.classList.toggle('picked', c.dataset.chip === DT[n].picked));
}
function dtPlace(n, zone) {
  if (DT[n].picked) dtMove(n, DT[n].picked, zone);
  else if (DT[n].placed[zone]) dtMove(n, DT[n].placed[zone], null);  // click a filled cell to take it back
}
function dtMove(n, chipId, zone) {
  const d = DT[n];
  if (quizState[n].done || !chipId) return;
  const chip = dtChipEl(n, chipId);
  if (!chip) return;
  Object.keys(d.placed).forEach(z => { if (d.placed[z] === chipId) delete d.placed[z]; });
  if (zone) {
    const prev = d.placed[zone];
    if (prev && prev !== chipId) dtPool(n).appendChild(dtChipEl(n, prev));
    d.placed[zone] = chipId;
    dtZoneEl(n, zone).appendChild(chip);
  } else {
    dtPool(n).appendChild(chip);
  }
  d.picked = null;
  document.querySelectorAll(`#q${n} .dt-chip`).forEach(c => c.classList.remove('picked', 'wrong'));
  document.querySelectorAll(`#q${n} .dt-zone`).forEach(z =>
    z.classList.toggle('is-filled', !!d.placed[z.dataset.zone]));
  quizCustomChange(n, Object.keys(d.placed).length === d.slots.length);
}

const dtKey = (n) => DT[n].slots.reduce((acc, z) => (acc[z] = z, acc), {});

function dtShowKey(n) {
  DT[n].user = { ...DT[n].placed };
  dtRender(n, dtKey(n), true);
  document.querySelectorAll(`#q${n} .dt-chip`).forEach(c => { c.draggable = false; c.classList.add('locked'); });
}

/* Showing the key overwrites the learner's table, so the deck asks for a way
   back to it. Runs from q.afterFeedback - quizShowFeedback rewrites the box,
   so anything appended before it would be thrown away. */
function dtAddMyAnswerToggle(n) {
  const box = document.getElementById(`q${n}-feedbox`);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fb-answer-toggle';
  btn.dataset.mode = 'correct';
  btn.textContent = 'إجابتي';
  btn.onclick = () => {
    const showMine = btn.dataset.mode === 'correct';
    dtRender(n, showMine ? DT[n].user : dtKey(n), !showMine);
    btn.dataset.mode = showMine ? 'mine' : 'correct';
    btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
  };
  box.appendChild(btn);
}

function dtRender(n, placed, isKey) {
  DT[n].slots.forEach(z => {
    const zone = dtZoneEl(n, z);
    const id = placed[z];
    zone.classList.toggle('is-filled', !!id);
    zone.classList.toggle('is-key', !!isKey);
    zone.classList.toggle('mark-bad', !isKey && !!id && id !== z);
    if (id) zone.appendChild(dtChipEl(n, id));
  });
  // anything not placed in this view goes back to the pool
  const shown = new Set(Object.values(placed));
  DT[n].slots.forEach(z => { if (!shown.has(z)) dtPool(n).appendChild(dtChipEl(n, z)); });
}


/* =====================================================================
   dslide 24 · deck slides 28-34 = ONE scroll screen (Elad 02.11.26: "28-34
   are 1 scroll slide"). The approved scroll-set policy (maven-skills §8l, the
   character-materials-02 behaviour Elad confirmed for this unit):
   - one section per deck slide, deck order; 28 + 30 are the data pages,
     29/31/32/33/34 hold the engine-built questions q24, q25, q26, q27, q127
     (each `embedIn` its host), moved in here so the engine's own marks, retry,
     partial titles, answer toggle and hint card work unchanged;
   - a section AFTER an unanswered question stays closed; each answer opens
     the next run and the scroll gesture shows again while more is below;
   - an answered צדקתי? only disables; המשך opens when every question is
     answered AND the learner reached the end of the scroll;
   - ONE stepper above the scroller, current = the first open question.
   ===================================================================== */
/* QA 03.11.26 (Elad): "questions 3-4 should be their own slide with scroll" -
   the set is now TWO scroll screens on the same mechanism: dslide 24 = deck
   28-29 (stepper question 2), dslide 25 = deck 30-31 (question 3),
   dslide 26 = deck 32-34 (question 4, parts א + ב).
   Each embedded question names its host with `embedIn`. */
const SS = {
  24: { prev: 23, next: 25, secs: [
    { deck: 28, html: `<div class="ss24-data">
        <div class="story-lead">
          <p>إليكم بيانات عن أرباح الادخار:<br>كان مبلغ الادّخار الابتدائي في عام 2022 هو 500 شيكل.<br>في السنة الأولى، ربح صاحب المدّخرات 5%.<br>في السنة الثانية، ربح <strong>5% إضافية</strong>.<br>وفي السنة الثالثة، ربح <strong>5% إضافية</strong>.</p>
          <p><strong>الادّعاء: ازدادت قيمة المدّخرات بنسبة 15%.</strong></p>
        </div>
        <img class="ss24-img" src="assets/img/savings-coins.png" alt="أكوام عملات تصعد أمام رسم بياني للنمو">
      </div>` },
    { deck: 29, q: 24 },
  ], end: false },
  25: { prev: 24, next: 26, secs: [
    { deck: 30, html: `<div class="ss24-data">
        <div class="story-lead">
          <p>إليكم بيانات عن أرباح مسار آخر للادّخار:<br>كان مبلغ الادّخار الابتدائي في عام 2022 هو 500 شيكل.<br>خسر صاحب المدّخرات 10% في السنة الأولى.<br>وربح 5% في السنة الثانية،<br>ثم ربح 5% مرة أخرى في السنة الثالثة.</p>
        </div>
      </div>` },
    { deck: 31, q: 25 },
  ], end: false },
  /* QA 03.11.26 (Elad, 2nd note): question 4 (parts א + ב) is its own scroll */
  26: { prev: 25, next: 28, secs: [
    { deck: 32, q: 26 },
    { deck: 33, q: 27 },
    { deck: 34, q: 127 },
  ], end: false },
};
const ssQs = (h) => SS[h].secs.filter(x => x.q).map(x => x.q);

function unitAfterQuizBuild() {
  Object.keys(SS).map(Number).forEach(h => { if (inPart(h)) ssBuild(h); });
}

function ssBuild(h) {
  const cfg = SS[h];
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  const firstQ = QUESTIONS.find(x => x.screen === ssQs(h)[0]);
  const sec = document.createElement('section');
  sec.className = 'screen ss24-screen';
  sec.dataset.screen = h;
  sec.id = `s${h}`;
  sec.innerHTML = `
    ${quizStepperHTML({ step: firstQ.step })}
    <div class="ss24-scroll" id="s${h}-scroll"><div class="ss24-inner">
      ${cfg.secs.map(x => `<div class="ss24-sec" data-deck="${x.deck}"${x.q ? ` data-q="${x.q}"` : ''}>${x.html || ''}</div>`).join('')}
    </div></div>
    <button class="btn-continue" id="s${h}-continue" disabled onclick="goTo(${cfg.next})">متابعة</button>
    <button class="btn-back" onclick="goTo(${cfg.prev})">رجوع</button>`;
  app.insertBefore(sec, backRef);
  /* move each engine section in, minus its .screen role (goTo must never pick
     it), its own stepper and its חזרה */
  ssQs(h).forEach(n => {
    const q = document.getElementById(`q${n}`);
    if (!q) return;
    q.classList.remove('screen');
    q.classList.add('ss24-q');
    q.querySelectorAll('.qstepper, .quiz-back').forEach(el => el.remove());
    sec.querySelector(`.ss24-sec[data-q="${n}"]`).appendChild(q);
  });
  const sc = document.getElementById(`s${h}-scroll`);
  sc.addEventListener('scroll', () => {
    const hint = document.getElementById(`s${h}-hint-scroll`);
    if (hint && (Math.abs(sc.scrollTop - (cfg.hintTop || 0)) > 40 ||
              sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 8)) hint.remove();
    ssLatchEnd(h);
  }, { passive: true });
  ssReveal(h);
}

/* a section after an unanswered question stays closed */
function ssReveal(h) {
  let open = true;
  document.querySelectorAll(`#s${h} .ss24-sec`).forEach(sec => {
    sec.classList.toggle('is-locked', !open);
    const n = Number(sec.dataset.q);
    if (n && !(quizState[n] && quizState[n].done)) open = false;
  });
  const qs = ssQs(h);
  const cur = qs.find(n => !(quizState[n] && quizState[n].done));
  const q = QUESTIONS.find(x => x.screen === (cur || qs[qs.length - 1]));
  const bar = document.querySelector(`#s${h} > .qstepper`);
  if (bar) bar.dataset.current = q.step.index;
  quizStepperUpdate(h, { step: q.step });
  /* a closed section measures 0, so its speech bubble is drawn once it opens */
  if (typeof decorateBubbles === 'function') requestAnimationFrame(() => decorateBubbles(document.getElementById(`s${h}`)));
}

function ssLatchEnd(h) {
  const sc = document.getElementById(`s${h}-scroll`);
  const last = document.querySelector(`#s${h} .ss24-sec:last-child`);
  if (sc && sc.clientHeight && last && !last.classList.contains('is-locked') &&
      sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 8) SS[h].end = true;
  ssGate(h);
}
function ssGate(h) {
  const btn = document.getElementById(`s${h}-continue`);
  if (btn) btn.disabled = !(SS[h].end && ssQs(h).every(n => quizState[n] && quizState[n].done));
}

/* the scroll gesture beside the bar whenever there is more below the view */
function ssHint(h, delay) {
  setTimeout(() => {
    const sec = document.getElementById(`s${h}`), sc = document.getElementById(`s${h}-scroll`);
    if (!sec || !sc || !sec.classList.contains('active')) return;
    const old = document.getElementById(`s${h}-hint-scroll`);
    if (old) old.remove();
    if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 8) return;
    SS[h].hintTop = sc.scrollTop;
    const el = document.createElement('div');
    el.className = 'ss-scroll-hint'; el.id = `s${h}-hint-scroll`; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="ss-gh-ring ss-gh-ring1"></div><div class="ss-gh-ring ss-gh-ring2"></div><img class="ss-gh-hand" src="assets/applets/gesture-hand.svg" alt="">';
    el.addEventListener('animationend', e => { if (e.target === el) el.remove(); });
    sec.appendChild(el);
  }, delay);
}

/* engine hook (quizFinish): an embedded question resolved */
function ssResolved(h, n) {
  if (!SS[h]) return;
  ssReveal(h);
  ssLatchEnd(h);
  const fb = document.getElementById(`q${n}-feedbox`);
  if (fb) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  ssHint(h, 900);
}

function ssEnter(h) {
  if (!document.getElementById(`s${h}`)) return;
  ssReveal(h);
  ssLatchEnd(h);
  ssHint(h, 320);
}


/* =====================================================================
   Screen 16 — deck slide 19 · the section menu
   The slide's production note, verbatim:
     כל ריבוע מפנה למקטע הקניה רלוונטי עם שם זהה.
     תמונות: הקטנה כפולה: חץ הקטנה כפולה, הגדלה כפולה מהבהב.
     שתי האופציות האחרות לא זמינות.
     בסוף כל מקטע הקנייה חזרה למסך הזה עם סימון דמות על החלק הנלמד.
     כפתור "متابعة" פעיל רק לאחר השלמת כל 4 החלקים.
   So the squares are live: the next one flashes, the rest are unavailable,
   each section returns here, the companion marks what was just learned, and
   `متابعة` unlocks only once all four are done. State is derived from
   quizState rather than stored, so it survives free navigation and the DEV bar.
   ===================================================================== */

const MAP_SECTIONS = [
  /* RTL: the first card renders rightmost — the deck's learning order.
     `arrows` is also in DOM order, so the first entry is the right-hand arrow.
     Deck directions, read off the rendered page: decrease is the down-right
     arrow, increase the up-right one. */
  { id: 'dec-dec', title: 'تخفيض مزدوج',           arrows: ['down', 'down'], entry: null, screens: [] },
  { id: 'inc-inc', title: 'تكبير مزدوج',           arrows: ['up',   'up'],   entry: 17,   screens: [17] },
  /* QA 14.10.26: the two mixed cards' arrow pairs were swapped — the pair reads
     left-to-right like a graph, so הקטנה ואחריה הגדלה is ↘↗ and the reverse ↗↘ */
  { id: 'dec-inc', title: 'نقصان<br>تليه زيادة', arrows: ['up',   'down'], entry: 18,   screens: [18] },
  { id: 'inc-dec', title: 'زيادة<br>يليها نقصان', arrows: ['down', 'up'],   entry: 20,   screens: [20, 21] },
];

/* section 1 is the guided flow the learner has already walked through to get
   here; the rest resolve from their questions */
const mapLearned = (sec) =>
  sec.screens.length === 0 || sec.screens.every(n => quizState[n] && quizState[n].done);

function buildMapScreen() {
  if (!inPart(16)) return;
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  const sec = document.createElement('section');
  sec.className = 'screen';
  sec.dataset.screen = 16;
  sec.id = 's16';
  sec.innerHTML = `
    <h1 class="map-title" data-reveal="1">تغييرات إضافية في النسب المئوية</h1>
    <div class="map-intro" data-reveal="1">
      <p>تعلّمنا حساب التخفيض المزدوج، وننتقل الآن إلى 3 خيارات إضافية.</p>
      <p><strong>تذكّروا: المبادئ واحدة. إذا تذكّرتموها، ستتمكّنون من حل أي تمرين!</strong></p>
    </div>
    <div class="map-cards" data-reveal="2">
      ${MAP_SECTIONS.map(s => `
        <button type="button" class="map-card" data-sec="${s.id}"
                onclick="mapOpen('${s.id}')" aria-label="${s.title.replace(/<br>/g, ' ')}">
          <span class="map-card-title">${s.title}</span>
          <span class="map-arrows">${s.arrows.map(a => `<img class="arr arr-${a}" src="assets/img/arrow-change.png" alt="">`).join('')}</span>
          <span class="map-char" data-reveal-fade>
            <span class="speech-bubble map-bubble">لقد تعلّمنا هذا من قبل!</span>
            <img src="assets/img/character-1-small.png" alt="شخصية مرافقة">
          </span>
        </button>`).join('')}
    </div>
    <button class="btn-continue" id="s16-continue" onclick="goTo(22)">متابعة</button>
    <button class="btn-back" onclick="goTo(15)">رجوع</button>`;
  app.insertBefore(sec, backRef);
}

function mapOpen(id) {
  const sec = MAP_SECTIONS.find(s => s.id === id);
  if (!sec || sec.entry == null) return;
  if (document.querySelector(`#s16 .map-card[data-sec="${id}"]`).disabled) return;
  goTo(sec.entry);
}

/* Repaint on every entry: which square is learned, which one is next (and
   flashing), which are still unavailable, where the companion stands, and
   whether `متابعة` has been earned. */
function mapRefresh() {
  const host = document.getElementById('s16');
  if (!host) return;
  const done = MAP_SECTIONS.map(mapLearned);
  const nextIdx = done.indexOf(false);
  let lastLearned = -1;
  for (let i = 0; i < done.length; i++) if (done[i]) lastLearned = i;

  MAP_SECTIONS.forEach((s, i) => {
    const card = host.querySelector(`.map-card[data-sec="${s.id}"]`);
    card.classList.toggle('is-learned', done[i]);
    card.classList.toggle('is-next', i === nextIdx);
    card.classList.toggle('is-locked', !done[i] && i !== nextIdx);
    card.disabled = done[i] || i !== nextIdx;
    /* QA 02.11.26 (replaces 14.10): the companion + "لقد تعلّمنا هذا من قبل!" stands
       ONCE under הקטנה כפולה - the first visit, when only that section is
       learned. On every later visit it is gone; only the next square flashes. */
    card.querySelector('.map-char').classList.toggle('is-here', i === 0 && lastLearned === 0);
  });
  const cont = document.getElementById('s16-continue');
  cont.disabled = nextIdx !== -1;
  cont.title = nextIdx === -1 ? '' : 'أنهوا الأجزاء الأربعة كلها';
  if (typeof decorateBubbles === 'function') decorateBubbles(host);
}

/* =====================================================================
   Screen 35 — deck slide 43 · OrderedDragAndDropQuestion · שאלה 3ג מתוך 3
   Two algebraic expressions drag into two slots. The deck pre-fills both
   slots in green (#92D050) — that is the key, not learner copy.
   ===================================================================== */

const AX_SLOTS = [
  { id: 'a', label: 'السعر النهائي في الخيار أ:', eq: '115% ∙ (80% ∙ x) = 1.15 ∙ (0.8 ∙ x) = 0.92x' },
  { id: 'b', label: 'السعر النهائي في الخيار ب:', eq: '80% ∙ (115% ∙ x) = 0.8 ∙ (1.15 ∙ x) = 0.92x' },
];
/* deck chip order, visual left -> right: the `80%∙(115%∙x)` chip is on the
   left, the `115%∙(80%∙x)` one on the right. RTL flow puts the first child
   rightmost, so 'a' comes first. */
const AX_POOL_ORDER = ['a', 'b'];
const axState = { placed: {}, picked: null, user: null };

const axEq = (id) => AX_SLOTS.find(x => x.id === id).eq;
const axChip = (id) => document.querySelector(`#q35 .ax-chip[data-chip="${id}"]`);
const axZone = (id) => document.querySelector(`#q35 .ax-zone[data-zone="${id}"]`);
const AX_KEY = () => AX_SLOTS.reduce((a, sl) => (a[sl.id] = sl.id, a), {});

QUESTIONS.push({
  /* producer 08.09: one attempt only on this one (the deck asked for two). With
     a single attempt an after-wrong hint could never appear, so the written
     hint is offered from the start. */
  screen: 35, type: 'custom', maxAttempts: 1, step: { group: 'p3', index: 3, total: 3 },
  hint: { body: `عبّروا بدلالة <span class="eq-ltr">x</span> عن سعر الوجبة في كلٍّ من الخيارين.` },
  stem: `<p><strong>ج. </strong>لنفترض أن السعر الأصلي للوجبة هو <span class="eq-ltr">x</span> شيكلًا.<br><strong>اسحبوا التعبير الجبري المناسب إلى كل خيار:</strong></p>`,
  html: `<div class="ax-rows">
      ${AX_SLOTS.map(sl => `<div class="ax-row">
        <span class="ax-label">${sl.label}</span>
        <div class="ax-zone" data-zone="${sl.id}" role="button" tabindex="0" aria-label="منطقة السحب: ${sl.label}"
             ondragover="event.preventDefault()" ondrop="axDrop(event, '${sl.id}')"
             onclick="axPlace('${sl.id}')"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();axPlace('${sl.id}');}"></div>
      </div>`).join('')}
    </div>
    <div class="ax-pool" aria-label="التعبيرات للسحب">
      ${AX_POOL_ORDER.map(id => `<div class="ax-chip" draggable="true" data-chip="${id}" tabindex="0" role="button"
           aria-label="التعبير ${axEq(id)}"
           ondragstart="axDragStart(event, '${id}')"
           onclick="axPick('${id}')"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();axPick('${id}');}"><span class="eq-ltr">${axEq(id)}</span></div>`).join('')}
    </div>`,
  content: PIZZA_OPTIONS,
  isCorrect: () => AX_SLOTS.every(sl => axState.placed[sl.id] === sl.id),
  anyPartRight: () => AX_SLOTS.some(sl => axState.placed[sl.id] === sl.id),
  markRetry: () => AX_SLOTS.forEach(sl => {
    const held = axState.placed[sl.id];
    if (held && held !== sl.id) axChip(held).classList.add('wrong');
  }),
  mark: () => {
    axState.user = { ...axState.placed };
    axRender(AX_KEY(), true);
    document.querySelectorAll('#q35 .ax-chip').forEach(c => { c.draggable = false; c.classList.add('locked'); });
  },
  afterFeedback: (screen, q, isCorrect) => { if (!isCorrect) axAddToggle(screen); },
  fb: {
    correct: { title: 'أحسنتم', body: S43_BODY },
    wrong:   { title: FB_WRONG_TITLE, body: S43_BODY },
    retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
  },
});

function axDragStart(ev, id) {
  if (quizState[35].done) return;
  axState.picked = id;
  ev.dataTransfer.setData('text/plain', id);
  ev.dataTransfer.effectAllowed = 'move';
}
function axDrop(ev, zone) { ev.preventDefault(); axMove(ev.dataTransfer.getData('text/plain') || axState.picked, zone); }
function axPick(id) {
  if (quizState[35].done) return;
  if (Object.values(axState.placed).includes(id)) { axMove(id, null); return; }
  axState.picked = axState.picked === id ? null : id;
  document.querySelectorAll('#q35 .ax-chip').forEach(c => c.classList.toggle('picked', c.dataset.chip === axState.picked));
}
function axPlace(zone) {
  if (axState.picked) axMove(axState.picked, zone);
  else if (axState.placed[zone]) axMove(axState.placed[zone], null);
}
function axMove(chipId, zone) {
  if (quizState[35].done || !chipId) return;
  const chip = axChip(chipId);
  if (!chip) return;
  Object.keys(axState.placed).forEach(z => { if (axState.placed[z] === chipId) delete axState.placed[z]; });
  if (zone) {
    const prev = axState.placed[zone];
    if (prev && prev !== chipId) document.querySelector('#q35 .ax-pool').appendChild(axChip(prev));
    axState.placed[zone] = chipId;
    axZone(zone).appendChild(chip);
  } else {
    document.querySelector('#q35 .ax-pool').appendChild(chip);
  }
  axState.picked = null;
  document.querySelectorAll('#q35 .ax-chip').forEach(c => c.classList.remove('picked', 'wrong'));
  document.querySelectorAll('#q35 .ax-zone').forEach(z => z.classList.toggle('is-filled', !!axState.placed[z.dataset.zone]));
  quizCustomChange(35, Object.keys(axState.placed).length === AX_SLOTS.length);
}
function axRender(placed, isKey) {
  const pool = document.querySelector('#q35 .ax-pool');
  AX_SLOTS.forEach(sl => {
    const zone = axZone(sl.id), id = placed[sl.id];
    zone.classList.toggle('is-filled', !!id);
    zone.classList.toggle('is-key', !!isKey);
    zone.classList.toggle('mark-bad', !isKey && !!id && id !== sl.id);
    if (id) zone.appendChild(axChip(id));
  });
  const shown = new Set(Object.values(placed));
  AX_SLOTS.forEach(sl => { if (!shown.has(sl.id)) pool.appendChild(axChip(sl.id)); });
}
function axAddToggle(screen) {
  const box = document.getElementById(`q${screen}-feedbox`);
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'fb-answer-toggle'; btn.dataset.mode = 'correct';
  btn.textContent = 'إجابتي';
  btn.onclick = () => {
    const showMine = btn.dataset.mode === 'correct';
    axRender(showMine ? axState.user : AX_KEY(), !showMine);
    btn.dataset.mode = showMine ? 'mine' : 'correct';
    btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
  };
  box.appendChild(btn);
}


/* =====================================================================
   Screen 43 — deck slide 52 · the class-task answer screen
   Note: "רק אחרי סימון כן/לא, הדמות והטיפ מופיעים וכפתור המשך זמין."
   There is no answer key — both radios are unfilled in the deck, because the
   answer is the learner's own measurement. So: no צדקתי?, no verdict; marking
   yes/no reveals the companion + tip and releases `متابعة`.
   ===================================================================== */

const ctState = { steps: '', pick: null };

function buildClassTaskScreen() {
  if (!inPart(43)) return;
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  const sec = document.createElement('section');
  sec.className = 'screen';
  sec.dataset.screen = 43;
  sec.id = 's43';
  sec.innerHTML = `
    <h1 class="task-title" data-reveal="1">مهمة صفية - هل عدنا إلى المكان نفسه؟</h1>
    <div class="task-body" data-reveal="2">
      <p class="task-q"><strong>ما المسافة بين المكان الذي وصلتم إليه في المرحلة 1 والمكان الذي وصلتم إليه بعد المرحلتين 2 و3؟</strong></p>
      <div class="value-box-row task-steps">
        <input type="text" inputmode="numeric" class="vi-input" id="s43-steps"
               aria-label="عدد الخطوات من خط البداية" oninput="ctInput()">
        <span class="vb-unit"><strong>خطوات</strong> من خط البداية</span>
      </div>
      <p class="task-q task-q--sub"><strong>هل وصلتم إلى الهدف الأصلي؟</strong></p>
      <div class="scq-answers task-yesno" role="radiogroup" aria-label="نعم أو لا">
        <div class="scq-opt" role="radio" aria-checked="false" tabindex="0" data-id="yes"
             onclick="ctPick(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ctPick(this);}">
          <span class="scq-radio"></span><span class="scq-opt-text">نعم</span></div>
        <div class="scq-opt" role="radio" aria-checked="false" tabindex="0" data-id="no"
             onclick="ctPick(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ctPick(this);}">
          <span class="scq-radio"></span><span class="scq-opt-text">لا</span></div>
      </div>
    </div>
    <div class="character-widget cw-task" id="s43-tip" hidden>
      <div class="speech-bubble"><strong>لم</strong> نصل إلى الهدف نفسه.<br>لنفهم السبب</div>
      <img src="assets/img/character-1-explain.png" alt="شخصية مرافقة">
    </div>
    <button class="btn-continue" id="s43-continue" disabled onclick="goTo(44)">متابعة</button>
    <button class="btn-back" onclick="goTo(42)">رجوع</button>`;
  app.insertBefore(sec, backRef);
}

function ctInput() {
  const el = document.getElementById('s43-steps');
  const clean = el.value.replace(/[^0-9.,]/g, '');
  if (clean !== el.value) el.value = clean;
  ctState.steps = el.value.trim();
}
function ctPick(el) {
  document.querySelectorAll('#s43 .task-yesno .scq-opt').forEach(o => {
    o.classList.toggle('selected', o === el);
    o.setAttribute('aria-checked', o === el ? 'true' : 'false');
  });
  ctState.pick = el.dataset.id;
  /* the note gates BOTH on the yes/no mark — the tip and the button appear
     together, and only then */
  document.getElementById('s43-tip').hidden = false;
  document.getElementById('s43-continue').disabled = false;
  if (typeof decorateBubbles === 'function') decorateBubbles(document.getElementById('s43'));
}
