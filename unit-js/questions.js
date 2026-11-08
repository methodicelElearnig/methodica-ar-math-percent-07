/* =====================================================================
   Unit content — question configs consumed by 720-core/quiz-engine.js.
   Source deck: methodica-math-percent-04-07.pptx (78 slides). Every
   learner-facing string below is verbatim from the slide XML, including the
   deck's own spacing and its NBSPs; bold runs are reproduced exactly.
   Build cards: docs/forensics/slides-02-24.md
   ===================================================================== */

'use strict';

/* ---------------------------------------------------------------------
   Speech bubbles — the approved component (Figma 551:12741 / 551:12742).
   The SVG shell is generated at each bubble's real rendered size so text
   can flow; decorateBubbles() is called by engine.js on every screen swap.
   Copied verbatim from proportion-02-01 (approved 07.09.26).
   --------------------------------------------------------------------- */
function bubblePathBottom(w, h) {
  const r = 10, i = 1, cx = w / 2, td = 15.3, tw = 17;
  return `M ${i + r} ${i} H ${w - i - r} A ${r} ${r} 0 0 1 ${w - i} ${i + r}` +
    ` V ${h - i - r} A ${r} ${r} 0 0 1 ${w - i - r} ${h - i}` +
    ` H ${cx + tw} L ${cx} ${h - i + td} L ${cx - tw} ${h - i}` +
    ` H ${i + r} A ${r} ${r} 0 0 1 ${i} ${h - i - r}` +
    ` V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}
function bubblePathSideLeft(w, h) {
  const r = 8.5, i = 1, cy = h / 2, td = 17.6, th = 11.3;
  return `M ${i + r} ${i} H ${w - i - r} A ${r} ${r} 0 0 1 ${w - i} ${i + r}` +
    ` V ${h - i - r} A ${r} ${r} 0 0 1 ${w - i - r} ${h - i}` +
    ` H ${i + r} A ${r} ${r} 0 0 1 ${i} ${h - i - r}` +
    ` V ${cy + th} L ${i - td} ${cy} L ${i} ${cy - th}` +
    ` V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}
/* 08.09 — the shell used to be drawn ONCE and never revisited
   (`if (b.querySelector('.bubble-shape')) return;`). If the bubble's box
   changed after that first draw — a column that re-flowed, an image that
   loaded, a screen decorated before layout settled — the painted shape kept
   the old size while the text kept the new one, and the copy ended up sitting
   near the top of an oversized bubble (producer: "fix the text bubble text
   centering"). The shell is now keyed to the measured size and redrawn
   whenever that size changes. */
function decorateBubbles(scope) {
  (scope || document).querySelectorAll('.speech-bubble').forEach(b => {
    const w = b.offsetWidth, h = b.offsetHeight;
    if (!w || !h) return;
    const key = w + 'x' + h;
    if (b.dataset.bubbleSize === key) return;
    b.dataset.bubbleSize = key;
    const stale = b.querySelector('.bubble-shape');
    if (stale) stale.remove();
    if (!b.dataset.bubbleWatched) {
      b.dataset.bubbleWatched = '1';
      if (window.ResizeObserver) new ResizeObserver(() => decorateBubbles(b.parentElement || b)).observe(b);
    }
    let svg;
    if (b.classList.contains('side-bubble')) {
      const td = 18;
      svg = `<svg class="bubble-shape" style="left:${-td}px;top:0;width:${w + td}px;height:${h}px" ` +
        `viewBox="${-td} 0 ${w + td} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<path d="${bubblePathSideLeft(w, h)}" fill="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
    } else {
      const td = 17;
      svg = `<svg class="bubble-shape" style="left:0;top:0;width:${w}px;height:${h + td}px" ` +
        `viewBox="0 0 ${w} ${h + td}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<path d="${bubblePathBottom(w, h)}" fill="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
    }
    b.insertAdjacentHTML('afterbegin', svg);
  });
}

/* Web fonts swap in after the first paint and change every bubble's measured
   width, so the shell drawn before that is the wrong size. Redraw once the
   fonts are actually ready (the per-bubble ResizeObserver then keeps up with
   anything later). */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => decorateBubbles(document));
}

const charWidget = (text, pose = 'assets/img/character-1.png', extra = '') => `
  <div class="character-widget ${extra}">
    <div class="speech-bubble">${text}</div>
    <img src="${pose}" alt="شخصية مرافقة">
  </div>`;


/* ---------------------------------------------------------------------
   Screen 14 — deck slide 17 · ValueInputQuestion (הכירו את היישומון)
   Answer 266 (350 × 0.8 = 280; 280 × 0.95 = 266).
   The deck's note: "משוב על תשובה נכונה לא זהה לגמרי למשוב על טעות" — only
   the opening line differs, the explanation body is the same in both.
   FLAG-PRODUCER: no hint and no attempts count are stated anywhere in deck
   slides 2-24. Built with the template default (2 attempts) and no hint
   button, matching the deck's bar, which carries no `אפשר רמז?` here.
   --------------------------------------------------------------------- */
const S17_BODY = `
  <p>السعر الأصلي للعبة كان 350 شيكلًا، وهذا هو <strong>الكل الأصلي</strong>.</p>
  <p>بعد الخصم الأول بنسبة 20% ندفع ثمن اللعبة 80% فقط من سعرها الأصلي، لذلك ضربنا 350 ₪ في 0.8 فحصلنا على 280 شيكلًا، وهذا هو <strong>الكل الجديد.</strong></p>
  <p>حسبنا السعر بعد الخصم بنسبة 5% من الكل الجديد عن طريق <strong>الضرب</strong> في 0.95 (95%)، فحصلنا على السعر النهائي: 266 شيكلًا. وهذا هو <strong>الكل النهائي.</strong></p>`;

/* Producer 08.09: every RED (final-wrong) feedback carries the one approved
   title — the same wording ratio-01-01 was signed off with. Defined once so
   it cannot drift screen to screen.
   NOTE: this is the FINAL-wrong title only. The retry box is red too, but at
   that point the answer has NOT been shown yet, so it keeps `fb.retry`
   ("الإجابة غير دقيقة، هل نحاول مرة أخرى؟") — using this title there would be a lie. */
const FB_WRONG_TITLE = 'هذا خطأ، والإجابة الصحيحة معروضة.<br>لنفهم السبب:';
/* QA 18.10.26 — the approved title for a partly-right final answer
   (TEMPLATES.md Sept conventions); the engine swaps it in for FB_WRONG_TITLE */
const FB_PARTIAL_TITLE = 'الإجابة ليست صحيحة بالكامل. الإجابة الكاملة معروضة.<br>لنفهم السبب:';
/* QA 02.11.26: a red feedback with NO body (dslides 13, 17, 18, 20, 21) ends
   after the first sentence - "בואו נבין למה:" promised an explanation that
   never came */
const FB_WRONG_TITLE_SHORT = 'هذا خطأ، والإجابة الصحيحة معروضة.';
const FB_PARTIAL_TITLE_SHORT = 'الإجابة ليست صحيحة بالكامل. الإجابة الكاملة معروضة.';

/* The approved feedback titles. Deck slides 20/21/23/24 carry NO feedback
   shapes at all; producer standing rule — "we use the template we have and its
   feedbacks" — so these are the titles the approved units ship, and the body is
   left empty rather than invented. FLAG-PRODUCER if wording is wanted. */
const FB_STD = {
  correct: { title: 'صحيح جدًا!', body: '' },
  wrong:   { title: FB_WRONG_TITLE_SHORT, body: '' },
  retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
};


/* =====================================================================
   Component 02 (methodica-math-percent-07-02) — deck slides 26-34.
   Four questions; Q2 and Q3 are one deck "PopupPageQuestion" pair each
   (stem page + answer page). The deck split them because they did not fit
   a PowerPoint slide and asked for scrolling; this build merges each pair
   into ONE screen with the story in the side column, because a normal
   slide in this project never scrolls. No copy is lost.
   ===================================================================== */

const P2_STEP = { group: 'p2', total: 4 };
const p2step = (index) => ({ ...P2_STEP, index });

/* Slide 27's feedback table. `a:tblPr` carries no rtl="1", so grid col 0 is the
   LEFTMOST: מה השלם? | אופן החישוב | השינוי. In an RTL table the FIRST cell
   renders rightmost, so the DOM order below is the deck's right-to-left order.
   QA 03.11.26 (dslide 23): the last cell reads 20%, as in the stem (the deck
   said 10%). */
const S27_TABLE = `
<table class="data-table fb-table">
  <thead><tr><th>التغيير</th><th>طريقة الحساب</th><th>ما هو الكل؟</th></tr></thead>
  <tbody>
    <tr>
      <td>زيادة بنسبة <strong>15%</strong> من 1,500</td>
      <td>الكل الجديد<br><span class="eq-ltr">1,500 · 1.15 = 1,725</span></td>
      <td><strong>1,725</strong><br>متبرعًا ومتبرعة</td>
    </tr>
    <tr>
      <td>انخفاض بنسبة <strong>20%</strong> من <strong>1,725</strong></td>
      <td>الكل النهائي<br><span class="eq-ltr">1,725 · 0.8 = 1,380</span></td>
      <td><strong>1,380</strong><br>متبرعًا ومتبرعة</td>
    </tr>
  </tbody>
</table>`;

/* Slides 30/31 share one explanation, and the deck marks it "המשוב ארוך,
   לאפשר גלילה" — the feedback box is the one place scrolling is allowed. */
const S30_BODY = `
  <p>لنتحقق من الادعاء:</p>
  <p>المبلغ الابتدائي كان 500 ₪.</p>
  <p>صاحب المدخرات خسر 10% في السنة الأولى، لذلك عند نهاية السنة الأولى تكون قيمة المدخرات: <span class="eq-ltr">0.9∙500=450</span></p>
  <p>في السنة الثانية ربح 5%، وتُحسب قيمة المدخرات من 450 ₪ (الكل الجديد): <span class="eq-ltr">1.05∙450=472.5</span></p>
  <p>في السنة الثالثة، ربح 5% مرة أخرى، وتُحسب قيمة المدخرات من 472.5 ₪ (الكل الجديد):<br><span class="eq-ltr">1.05∙472.5=496.125</span></p>
  <p><strong>الاستنتاج: </strong>المبلغ النهائي ليس 500 ₪، بل أقل منه، ولذلك فالادّعاء غير صحيح.</p>
  <p>قارنوا بالنتائج التي حصلتم عليها في التطبيق.</p>`;

const S29_BODY = `
  <p>لأنّ الفائدة تُحسب كل سنة من «الكل الجديد» (وليس من «الكل الأصلي»)، لا يمكن جمع النسب المئوية. في كل سنة يُحسب الربح البالغ 5% من مبلغ السنة السابقة، ولذلك تزيد المدخرات في نهاية المطاف بأكثر من 15%.</p>
  <p>الاستنتاج: العبارة 2 صحيحة.</p>`;


/* =====================================================================
   Component 03 (methodica-math-percent-07-03) — deck slides 36-48.
   Three questions; Q1 has sub-parts א/ב, Q3 has א/ב/ג/ד. Every note in the
   component states: "רמז זמין אחרי ניסיון מענה שגוי ראשון" + "2 ניסיונות מענה",
   except slide 44 ("אין רמז בסעיף זה", "ניסיון מענה אחד").
   ===================================================================== */

const P3_STEP = { group: 'p3', total: 3 };
const p3step = (index) => ({ ...P3_STEP, index });
/* QA 14.10.26: the מועד ב tail (dslides 38-40, "שאלה 1א/ב/ג מתוך 1") gets its
   own stepper with one station per sub-question */
const P3B = { group: 'p3b', total: 3, labels: ['سؤال 1أ', 'سؤال 1ب', 'سؤال 1ج'] };
const p3bstep = (index) => ({ ...P3B, index });

/* Producer 08.09: where the deck puts the given data on the section's stem
   page, it belongs at the TOP OF THE STEM as plain text — above the
   sub-question, exactly as the pptx sets it — not in a bordered panel beside
   it. `.story-lead` is that block. */

/* QA 14.10.26: the cards are dslide 32's, word for word (single spaces, the
   same two-line breaks). Shared by dslides 33-35. */
/* QA 02.11.26 - the finished rectangle table (deck 33's key), shown read-only
   above deck 34's dropdowns so the learner can compare */
const DT_TABLE_DONE = `
<table class="data-table dt-table dt-table--done">
  <thead><tr>
    <th class="dt-corner"></th>
    <th>طول المستطيل (سم)</th>
    <th>عرض المستطيل<br>(سم)</th>
    <th>محيط المستطيل<br>(سم)</th>
    <th>مساحة المستطيل<br>(سم²)</th>
  </tr></thead>
  <tbody>
    <tr><th scope="row">المستطيل الأصلي</th><td><span class="eq-ltr">3a</span></td><td><span class="eq-ltr">a</span></td>
      <td><span class="eq-ltr">2∙3a+2∙a = 8a</span></td><td><span class="eq-ltr">3a∙a = 3a²</span></td></tr>
    <tr><th scope="row">مستطيل جديد</th><td><span class="eq-ltr">1.4∙3a = 4.2a</span></td><td><span class="eq-ltr">0.6∙a = 0.6a</span></td>
      <td><span class="eq-ltr">2∙4.2a+2∙0.6a = 9.6a</span></td><td><span class="eq-ltr">4.2a∙0.6a = 2.52a²</span></td></tr>
  </tbody>
</table>`;

const PIZZA_OPTIONS = `<div class="opt-cards">
    <div class="opt-card">
      <h3>الخيار أ</h3>
      <p>تطبيق قسيمة الخصم بنسبة 20% أولًا،<br>ثم إضافة رسوم توصيل بنسبة 15%.</p>
    </div>
    <div class="opt-card">
      <h3>الخيار ب</h3>
      <p>إضافة رسوم توصيل بنسبة 15% أولًا،<br>ثم تطبيق قسيمة الخصم بنسبة 20%.</p>
    </div>
  </div>`;



/* the proportion table the deck drops into slides 46 and 48's feedback.
   `a:tblPr` carries no rtl="1" there, so grid col 0 is the LEFTMOST — the
   percent column. In an RTL table the FIRST cell renders rightmost, so the
   quantity column is written first here.
   🚩 slide 46's own header cell reads `מספר צפיות` ("number of views") on a
   question about megabytes — a leftover. The correct header is passed in. */
const PROP_TABLE = (unitHead, part, whole) => `
<table class="data-table fb-table fb-table--prop">
  <thead><tr><th>${unitHead}</th><th>النسبة المئوية</th></tr></thead>
  <tbody>
    <tr><td>${part}</td><td><strong><span class="eq-ltr">x</span></strong></td></tr>
    <tr><td>${whole}</td><td>100%</td></tr>
  </tbody>
</table>`;

/* QA 14.10.26 — the approved Tooltip (Figma 720 UI-Templates 2045:20271): a
   15px Math-purple "i" beside the term, a 208px white panel on hover / tap.
   Same markup as the static one on dslide 62. */
const TERM_INFO_ICON = '<svg class="term-info-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><rect width="15" height="15" rx="7.5" fill="#3B2FC2"/><path d="M7.12219 12.327C6.89019 12.327 6.69419 12.293 6.53419 12.225C6.37819 12.157 6.26419 12.063 6.19219 11.943C6.12019 11.819 6.09419 11.673 6.11419 11.505C6.13419 11.325 6.16219 11.105 6.19819 10.845C6.23819 10.585 6.28019 10.293 6.32419 9.969C6.37219 9.645 6.42419 9.295 6.48019 8.919C6.53619 8.543 6.59019 8.151 6.64219 7.743C6.69819 7.335 6.75419 6.919 6.81019 6.495L6.11419 6.165L6.19819 5.691L8.28019 5.397L8.57419 5.535L7.78219 10.995C7.76219 11.139 7.77019 11.249 7.80619 11.325C7.84219 11.397 7.90019 11.433 7.98019 11.433C8.05219 11.433 8.13019 11.411 8.21419 11.367C8.30219 11.319 8.41419 11.239 8.55019 11.127L8.70619 11.493C8.66219 11.553 8.57219 11.649 8.43619 11.781C8.30419 11.913 8.12819 12.037 7.90819 12.153C7.68819 12.269 7.42619 12.327 7.12219 12.327ZM7.84219 4.593C7.60619 4.593 7.40419 4.505 7.23619 4.329C7.07219 4.153 6.99619 3.947 7.00819 3.711C7.02019 3.419 7.11619 3.173 7.29619 2.973C7.48019 2.773 7.72619 2.673 8.03419 2.673C8.29819 2.673 8.50819 2.759 8.66419 2.931C8.82019 3.099 8.89619 3.293 8.89219 3.513C8.88819 3.817 8.79819 4.073 8.62219 4.281C8.44619 4.489 8.18619 4.593 7.84219 4.593Z" fill="white"/></svg>';
const termTip = (term, tip, below = true) =>
  `<span class="tooltip-word">${term}<button type="button" class="term-info" aria-label="${tip}"` +
  ` onclick="this.classList.toggle('is-open')">${TERM_INFO_ICON}<span class="term-tooltip${below ? ' term-tooltip--below' : ''}">${tip}</span></button></span>`;

const S46_BODY = `
  <p>لنحسب كم في المئة تمثل 81 ميغابايت من 300 ميغابايت.<br>نضع في جدول التناسب:</p>
  ${PROP_TABLE('الحجم (MB)', '81', '300')}
  <p>نبني معادلة التناسب: <span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">x</span><span class="frac-bottom">100</span></span> = <span class="fraction fr-inline"><span class="frac-top">81</span><span class="frac-bottom">300</span></span></span></p>
  <p>نضرب في المقام المشترك (300)، فنحصل على: <span class="eq-ltr">3x = 81</span><br>نقسم على 3، فنحصل على: <span class="eq-ltr">x = 27</span></p>
  <p>الاستنتاج: تشغل التأثيرات 27% من ملف الفيديو.</p>`;

const S47_BODY = `
  <p>هذه حالة تخفيض مزدوج.<br>لنحسب نسبة الانخفاض بعد عمليتي الضغط:<br>بعد عملية الضغط الأولى، يتبقّى 88% من <strong><span class="eq-ltr">81MB</span></strong>:</p>
  <p><span class="eq-ltr">88% ∙ 81 = <span class="fraction fr-inline"><span class="frac-top">88</span><span class="frac-bottom">100</span></span> ∙ 81 = 71.28</span></p>
  <p>بعد عملية الضغط الثانية، يتبقّى 85% من <strong><span class="eq-ltr">71.28MB</span></strong>:</p>
  <p><span class="eq-ltr">85% ∙ 71.28 = <span class="fraction fr-inline"><span class="frac-top">85</span><span class="frac-bottom">100</span></span> ∙ 71.28 = 60.588</span></p>
  <p>الاستنتاج:<br>بعد عملية الضغط الثانية، تشغل التأثيرات حجمًا قدره <span class="eq-ltr">60.588MB</span>.</p>`;

const S48_BODY = `
  <p>أولًا نحسب مقدار الانخفاض:</p>
  <p><span class="eq-ltr">81MB − 60.588MB = 20.412MB</span></p>
  <p>الآن سنحسب بكم في المئة يبلغ هذا التغيير:</p>
  ${PROP_TABLE('حجم المساحة المشغولة (MB)', '20.412', '81')}
  <p>نبني معادلة التناسب: <span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">x</span><span class="frac-bottom">100</span></span> = <span class="fraction fr-inline"><span class="frac-top">20.412</span><span class="frac-bottom">81</span></span></span></p>
  <p>نضرب في المقام المشترك (8100) فنحصل على:<br><span class="eq-ltr">81x = 2041.2</span></p>
  <p>نقسم على 81 فنحصل على: <span class="eq-ltr">x = 25.2</span></p>
  <p>الاستنتاج: انخفضت كمية التخزين بنحو 25.2%</p>`;

const S38_BODY = `
  <p>السعر بعد التخفيض في يناير هو:</p>
  <p class="eq-center"><strong><span class="eq-ltr">90% ∙ 40 = <span class="fraction fr-inline"><span class="frac-top">90</span><span class="frac-bottom">100</span></span> ∙ 40 = 0.9 ∙ 40 = <span class="eq-unit" dir="rtl">36 شيكل</span></span></strong></p>
  <p>قبل التخفيض في فبراير، تغيّر الكل وأصبح 36 ₪.</p>
  <p>بعد التخفيض في فبراير، نحسب 90% من 36:</p>
  <p class="eq-center"><span class="eq-ltr">90% ∙ 36 = <span class="fraction fr-inline"><span class="frac-top">90</span><span class="frac-bottom">100</span></span> ∙ 36 = 0.9 ∙ 36 = <span class="eq-unit" dir="rtl">32.4 شيكل</span></span></p>
  <p>سعر التذكرة بعد التخفيض في فبراير هو 32.4 شيكل.</p>`;

const S39_BODY = `
  <p>بعد ارتفاع بنسبة 30% يصبح سعر البنطلون 130% من السعر الأصلي (250 ₪):</p>
  <p><span class="eq-ltr">130% ∙ 250 = <span class="fraction fr-inline"><span class="frac-top">130</span><span class="frac-bottom">100</span></span> ∙ 250 = 325</span></p>
  <p>بعد خصم 30%، ندفع 70% من السعر الجديد (325 ₪)، لذلك يكون سعر البنطلون النهائي:</p>
  <p><span class="eq-ltr">70% ∙ 325 = <span class="fraction fr-inline"><span class="frac-top">70</span><span class="frac-bottom">100</span></span> ∙ 325 = 227.5</span></p>
  <p>بعد التغييرين، سعر البنطلون أقل من 250 ₪.</p>`;

const S41_TABLE = `
<table class="data-table fb-table fb-table--pizza">
  <thead><tr>
    <th>خيار</th>
    <th>المبلغ المدفوع بالشيكل<br>بعد المرحلة 1</th>
    <th>المبلغ المدفوع بالشيكل<br>بعد المرحلة 2</th>
  </tr></thead>
  <tbody>
    <tr>
      <td><strong>أ: قسيمة الخصم أولًا (تخفيض ثم تكبير)</strong></td>
      <td><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">80</span><span class="frac-bottom">100</span></span> × 112 = 89.6</span></td>
      <td><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">115</span><span class="frac-bottom">100</span></span> × 89.6 = 103.04</span></td>
    </tr>
    <tr>
      <td><strong>ب: رسوم التوصيل أولًا<br>(تكبير ثم تخفيض)</strong></td>
      <td><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">115</span><span class="frac-bottom">100</span></span> × 112 = 128.8</span></td>
      <td><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">80</span><span class="frac-bottom">100</span></span> × 128.8 = 103.04</span></td>
    </tr>
  </tbody>
</table>`;

const S42_BODY = `
  <p>في الحالتين نضرب 112 في العاملين نفسيهما، لكن بترتيب مختلف:</p>
  <p>الخيار أ: <span class="eq-ltr">1.15 · (0.8 · 112)</span><br>الخيار ب: <span class="eq-ltr">0.8 · (1.15 · 112)</span></p>
  <p>وفقًا لقانون التبديل، لا يؤثّر ترتيب العوامل في ناتج الضرب،<br>ولذلك يكون السعر النهائي في الخيارين 103.04 ₪.</p>`;

const S43_BODY = `
  <p>نمثّل سعر الوجبة بالرمز <span class="eq-ltr">x</span>.</p>
  <p>في الخيار أ، نطبّق قسيمة الخصم بنسبة 20% أولًا،<br>ثم نضيف رسوم توصيل بنسبة 15%.<br>التعبير الجبري للخيار أ هو:<br><span class="eq-ltr">115% ∙ (80% ∙ x) = 1.15 ∙ (0.8 ∙ x) = 0.92x</span></p>
  <p>في الخيار ب، نضيف رسوم توصيل بنسبة 15% أولًا، ثم نطبّق قسيمة الخصم بنسبة 20%. ويكون الحساب النهائي:<br><span class="eq-ltr">80% ∙ (115% ∙ x) = 0.8 ∙ (1.15 ∙ x) = 0.92x</span></p>`;


/* =====================================================================
   Component 05 (methodica-math-percent-07-05) — deck slides 55-62.
   Four questions; Q2 spans a scenario page + its question, Q3 and Q4 each
   have parts א/ב. No note in the whole section states hint timing or attempt
   count, so the deck-wide convention applies: hint after the first wrong
   attempt, 2 attempts (notesSlide41). FLAG-PRODUCER.
   ===================================================================== */

const P5_STEP = { group: 'p5', total: 4 };
const p5step = (index) => ({ ...P5_STEP, index });

/* the two-route table, on canvas on slide 57 and again on 58. `a:tblPr` has no
   rtl, so grid col 0 is the LEFTMOST = מסלול ב׳; in an RTL table the first
   cell renders rightmost, so מסלול א׳ is written first here. */
const ROUTES_TABLE = (short) => `
<table class="data-table routes-table">
  <tbody><tr>
    <td>
      <h4>مسار أ</h4>
      ${short
        ? `<p>في الأسبوع الأول، <strong>تقليل</strong> عدد الخطوات الأصلي بنسبة 25%.</p>
           <p>في الأسبوع الثاني، <strong>زيادة</strong> عدد الخطوات المحدّد في الأسبوع الأول بنسبة 10%.</p>`
        /* QA 14.10.26 (dslide 47): paragraphs spaced; "ב-10%." continues its
           sentence instead of dropping to a line of its own */
        : `<p>في الأسبوع الأول، <strong>تقليل</strong> عدد الخطوات اليومي الأصلي بنسبة 25%.</p>
           <p>في الأسبوع الثاني، <strong>زيادة</strong> عدد الخطوات اليومي المحدّد في الأسبوع الأول بنسبة 10%.</p>`}
    </td>
    <td>
      <h4>مسار ب</h4>
      ${short
        ? `<p class="route-oneline">تقليل عدد الخطوات الأصلي بنسبة 15%.</p>`
        : `<p class="route-oneline">تقليل عدد الخطوات اليومي الأصلي بنسبة 15%.</p>`}
    </td>
  </tr></tbody>
</table>`;

/* 🚩 DECK MATHS ERROR, in BOTH feedback panels of slide 56:
   `130%∙168=1.3∙160=218.4` — the `160` should be `168` (1.3×168 = 218.4;
   1.3×160 = 208). Corrected here and flagged. */
const S56_BODY = `
  <p><strong>المنتج أ:</strong><br>بعد زيادة السعر بنسبة 30%، يصبح سعره الجديد:</p>
  <p><strong><span class="eq-ltr">130% ∙ 240 = 1.3 ∙ 240 = 312</span></strong></p>
  <p>بعد تخفيض بنسبة 30% من السعر الجديد، يصبح سعره النهائي: <span class="eq-ltr">70% ∙ 312 = 0.7 ∙ 312 = 218.4</span></p>
  <p><strong>المنتج ب:</strong><br>بعد تخفيض السعر بنسبة 30%، يصبح سعره الجديد:</p>
  <p><strong><span class="eq-ltr">70% ∙ 240 = 0.7 ∙ 240 = 168</span></strong></p>
  <p>بعد زيادة بنسبة 30% على السعر الجديد، يصبح سعره النهائي: <span class="eq-ltr">130% ∙ 168 = 1.3 ∙ 168 = 218.4</span></p>
  <p><strong>الاستنتاج: السعر النهائي للمنتجين متساوٍ.</strong></p>`;

const S58_TABLE = `
<table class="data-table fb-table fb-table--steps">
  <thead><tr>
    <th>المسار</th><th>عدد الخطوات بعد التخفيض</th><th>عدد الخطوات بعد الزيادة</th>
  </tr></thead>
  <tbody>
    <tr><td><strong>أ</strong></td>
        <td><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">75</span><span class="frac-bottom">100</span></span> × 8,000 = 6,000</span></td>
        <td><strong><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">110</span><span class="frac-bottom">100</span></span> × 6,000 = 6,600</span></strong></td></tr>
    <tr><td><strong>ب</strong></td>
        <td><strong><span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">85</span><span class="frac-bottom">100</span></span> × 8,000 = 6,800</span></strong></td>
        <td></td></tr>
  </tbody>
</table>`;
const S58_BODY = S58_TABLE +
  `<p class="fb-after-table">الاستنتاج: بعد مرور أسبوعين، سيكون الهدف اليومي في المسار أ أقل - 6,600 خطوة مقابل 6,800 خطوة.</p>`;

const S59_BODY = `
  <p>كان سامر يشرب <span class="eq-ltr">a</span> كوبًا من الماء في اليوم.</p>
  <!-- QA 14.10.26: equations and line breaks exactly as the deck RENDERS them
       (slide 59's runs put through the bidi algorithm): "140%∙a=1.4∙a = 1.4a" -->
  <p>في الأسبوع الأول، زاد كمية الماء التي يشربها بنسبة 40%،<br>فأصبح يشرب: <span class="eq-ltr">140% ∙ a = 1.4 ∙ a = 1.4a</span> كوبًا يوميًا.</p>
  <p>بعد أسبوعين، زاد هذه الكمية بنسبة 25%، ولذلك<br>أصبح يشرب:<br><span class="eq-ltr">125% ∙ 1.4a = 1.25 ∙ 1.4a = 1.75a</span> كوبًا يوميًا.</p>
  <p>بعد الزيادة الثانية، يشرب سامر <span class="eq-ltr">1.75a</span> كوبًا من الماء يوميًا.</p>`;

/* 🚩 the deck's own line renders as `0.75a = a – 1.75a` — the run order is
   bidi-scrambled in the XML. The intended statement is below. Flagged. */
const S60_BODY = `
  <p>انتقل سامر من شرب <span class="eq-ltr">a</span> كوبًا من الماء إلى <span class="eq-ltr">1.75a</span> كوبًا يوميًا.</p>
  <p>ازدادت كمية الأكواب التي يشربها بمقدار: <span class="eq-ltr">1.75a − a = 0.75a</span></p>
  <p>لنحسب كم في المئة يمثّل <span class="eq-ltr">0.75a</span> من <span class="eq-ltr">a</span>.</p>
  <p>لهذا الغرض، نضع المعلومات المعروفة لدينا في جدول التناسب:</p>
  ${PROP_TABLE('عدد الأكواب', '<span class="eq-ltr">0.75a</span>', '<span class="eq-ltr">a</span>')}
  <p>نبني معادلة التناسب: <span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">x</span><span class="frac-bottom">100</span></span> = <span class="fraction fr-inline"><span class="frac-top">0.75a</span><span class="frac-bottom">a</span></span></span></p>
  <p>نختزل بالقسمة على <span class="eq-ltr">a</span>، فنحصل على: <span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">x</span><span class="frac-bottom">100</span></span> = 0.75</span></p>
  <p>نضرب في المقام المشترك (100) فنحصل على: <span class="eq-ltr">x = 75</span></p>
  <p>الاستنتاج: زاد سامر عدد أكواب الماء التي يشربها بنسبة 75%.</p>`;

const S61_BODY = `
  <p>أجر سلمى الأصلي هو <span class="eq-ltr">k</span> شيكلًا لكل ساعة عمل.</p>
  <p>بعد الزيادة الأولى بنسبة 10%، ستحصل سلمى على:</p>
  <p><span class="eq-ltr">110% ∙ k = 1.1 ∙ k = 1.1k</span></p>
  <p>أي: <span class="eq-ltr">1.1k</span> ₪ لكل ساعة عمل.</p>
  <p>بعد الزيادة الثانية بنسبة 10%، ستحصل سلمى على:</p>
  <p><span class="eq-ltr">110% ∙ 1.1k = 1.1 ∙ 1.1k = 1.21k</span></p>
  <p>أي: <span class="eq-ltr">1.21k</span> ₪ لكل ساعة عمل.</p>`;

const S62_BODY = `
  <p>إذا كان أجر سلمى الابتدائي 25 ₪ للساعة، فإن <span class="eq-ltr">k = 25</span>.</p>
  <p>يمكن تعويضه في التعبير الذي يصف الأجر عن كل ساعة عمل بعد انقضاء شهرين:</p>
  <p><span class="eq-ltr">1.21k</span></p>
  <p>نعوّض فنحصل على:</p>
  <p><span class="eq-ltr">1.21k = 1.21 ∙ 25 = 30.25</span></p>
  <p>الاستنتاج: بعد شهرين من العمل، أصبح أجر سلمى 30.25 ₪ لكل ساعة عمل.</p>`;


/* =====================================================================
   Component 06 (07-06) — deck slides 63-71 · שאלת שיא, מועד א׳
   Four sub-questions across the three shops; the gate is stated in slide 64's
   copy: answer 3 of 4 correctly. No note states hint timing; slide 71 is the
   only one that states attempts ("ניסיון מענה אחד").
   ===================================================================== */

const P6_STEP = { group: 'p6', total: 4 };
const p6step = (index) => ({ ...P6_STEP, index });

const S66_BODY = `
  <p>وفقًا للعرض في المتجر:</p>
  <p>الحقيبة المدرسية الأولى تكلّف 200 شيكل، والحقيبة الثانية نصف سعرها، أي: 100 شيكل.</p>
  <p>المجموع 300 شيكل.</p>
  <p>تتقاسم ندى ويوسف التكلفة، ولذلك سيدفع كلٌّ منهما 150 شيكلًا مقابل حقيبته المدرسية.</p>`;

const S68_BODY = `
  <p>هذه حالة تخفيض مزدوج.</p>
  <p>بعد <strong>الخصم الأول</strong> بنسبة 25%، يصبح سعر الحقيبة المدرسية:</p>
  <p><span class="eq-ltr">75% ∙ 200 = <span class="fraction fr-inline"><span class="frac-top">75</span><span class="frac-bottom">100</span></span> ∙ 200 = 150</span></p>
  <p>بعد <strong>خصم إضافي</strong> بنسبة 25%:</p>
  <p><span class="eq-ltr">75% ∙ 150 = <span class="fraction fr-inline"><span class="frac-top">75</span><span class="frac-bottom">100</span></span> ∙ 150 = 112.5</span></p>
  <p>بعد خصمين، يصبح سعر الحقيبة المدرسية 112.5 شيكل.</p>`;

const S69_BODY = `
  <p>هذا تخفيض مزدوج.</p>
  <p>السعر بعد <strong>الخصم الأول</strong> بنسبة 30%:</p>
  <p><span class="eq-ltr">70% ∙ 200 = <span class="fraction fr-inline"><span class="frac-top">70</span><span class="frac-bottom">100</span></span> ∙ 200 = 140</span></p>
  <p>السعر بعد <strong>خصم إضافي</strong> بنسبة 20% هو:</p>
  <p><span class="eq-ltr">80% ∙ 140 = <span class="fraction fr-inline"><span class="frac-top">80</span><span class="frac-bottom">100</span></span> ∙ 140 = 112</span></p>
  <p>الاستنتاج: بعد الخصمين، سيكون سعر الحقيبة المدرسية 112 شيكلًا.</p>`;

const S71_BODY = `
  <p>لأنّ الأمر يتعلّق بنقصانين متتاليين، فإنّ ترتيبهما لا يغيّر النتيجة.</p>
  <p>أيضًا في الزيادتين، لن يتغيّر ترتيب العمليات.</p>`;

/* =====================================================================
   Component 07 (07-07) — deck slides 72-78 · שאלת שיא, מועד ב׳
   Three sub-questions about the lake. The deck shows no progress strip on
   75-77, so these carry no stepper.
   ===================================================================== */

const S75_BODY = `
  <p>هذه حالة تخفيض مزدوج.</p>
  <p>بعد انخفاض بنسبة 50% من 120 ألف متر مكعب، بقي في الخزان نصف كمية المياه، أي: 60 ألف متر مكعب.</p>
  <p>أدّى سحب المياه في أغسطس إلى تقليل الكمية بنسبة 30% إضافية، فتبقّى 70% من الكمية الجديدة: <span class="eq-ltr">70% ∙ 60 = <span class="fraction fr-inline"><span class="frac-top">70</span><span class="frac-bottom">100</span></span> ∙ 60 = 42</span></p>
  <p>الإجابة: في نهاية الصيف بقي في الخزان 42 ألف متر مكعب من المياه.</p>`;

const S76_BODY = `
  <p>نحسب بكم ألف متر مكعب انخفض حجم المياه:</p>
  <p><span class="eq-ltr">120 − 42 = 78</span> ألف متر مكعب.</p>
  <p>حجم المياه انخفض بمقدار 78 ألف متر مكعب.</p>
  <p>الآن سنحسب كم <strong>بالمئة</strong> تمثل 78 ألف متر مكعب من أصل 120 ألف متر مكعب:</p>
  <p>لهذا الغرض، نضع القيم في جدول التناسب:</p>
  ${PROP_TABLE('حجم المياه بالمتر المكعب (بالآلاف)', '78', '120')}
  <p>نبني معادلة التناسب: <span class="eq-ltr"><span class="fraction fr-inline"><span class="frac-top">x</span><span class="frac-bottom">100</span></span> = <span class="fraction fr-inline"><span class="frac-top">78</span><span class="frac-bottom">120</span></span></span></p>
  <p>سنضرب في المقام المشترك (600) فنحصل على: <span class="eq-ltr">6x = 5 ∙ 78</span></p>
  <p>نقسم على 6 فنحصل على: <span class="eq-ltr">x = 65</span></p>
  <p>الاستنتاج: النسبة المئوية الإجمالية لانخفاض حجم المياه في الخزان هي 65%.</p>`;

const S77_BODY = `
  <p>لا يمكن جمع النسب المئوية وقول إن الانخفاض الكلي هو <span class="eq-ltr">50% + 30% = 80%</span>، لأن كل نسبة مئوية تُحسب من كل مختلف.</p>
  <p>لم تُحسب كمية المياه المسحوبة في أغسطس من 120 ألف متر مكعب، بل من الكمية المتبقية بعد يوليو، وهي 60 ألف متر مكعب.</p>
  <p>في النهاية بقي في خزان المياه 42 ألف متر مكعب، وهي 35% من الكمية الأصلية.<br> لذلك، يكون الانخفاض الإجمالي 65%.</p>`;

const QUESTIONS = [
  {
    screen: 14,
    label: '',                      /* no progress strip in this component */
    type: 'value-input',
    maxAttempts: 2,
    stem: `<h1 class="q-title">تعرّفوا على التطبيق</h1>
      <p class="q14-lead">لاحقًا في الوحدة سنستعين بالتطبيق. لتتعرفوا عليه، أجيبوا عن السؤال التالي باستخدامه:</p>
      <p>السعر الأصلي للعبة حاسوب هو 350 شيكلًا.<br>قبل نحو أسبوعين، بدأ عرض يتضمّن <strong>خصمًا (انخفاضًا)</strong> بنسبة 20% من السعر الأصلي،<br>وبعد نحو أسبوع، أُضيف <strong>خصم (انخفاض)</strong> آخر بنسبة 5%.</p>
      <p class="q14-task">أدخلوا معطيات السؤال، واضغطوا على "بدء التدريب" وأجيبوا:<br><strong class="q-ask">ما سعر اللعبة بعد الخصم المزدوج؟</strong></p>`,
    valueBox: { unit: 'شيكل', label: 'سعر اللعبة بعد الخصم المزدوج' },
    correctInputs: ['266'],
    /* QA 02.11.26: ?gh=1 turns on the step-2 tap hint - this screen only */
    content: appletEmbed('assets/applets/two-step-percent.html?gh=1', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'صحيح!', body: S17_BODY },
      wrong: { title: FB_WRONG_TITLE, body: S17_BODY },
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 17 — deck slide 20 · ValueInputQuestion (הגדלה כפולה)
     450 x 1.1 = 495; 495 x 1.05 = 519.75
     ------------------------------------------------------------------- */
  {
    screen: 17, label: '', type: 'value-input', maxAttempts: 2,
    /* section entered from the map on screen 16 — both ways lead back to it */
    prev: 16, next: 16,
    stem: `<h1 class="q-title q-title--navy">زيادتان متتاليتان (في السعر)</h1>
      <p>سعر آلة آيس كريم في متجر للأجهزة الكهربائية هو 450 شيكلًا (الكل الأصلي).<br>مع اقتراب الصيف، ارتفع سعرها بنسبة 10% (السعر بعد الزيادة<br>هو الكل الجديد). وفي شهر أغسطس، ارتفع السعر بنسبة 5% إضافية<br>(السعر بعد هذه الزيادة يُحسب من الكل الجديد، وهو الكل النهائي).</p>
      <p><strong>استعينوا بالتطبيق واحسبوا:</strong><br>
        <strong>ما سعر الآلة بعد الزيادتين (الكل النهائي)؟</strong><br>
        <!-- QA 02.11.26 (Nir): first decimal answer in the unit -->
        يمكن إدخال عدد عشري أيضًا.</p>`,
    valueBox: { unit: 'شيكل', label: 'سعر الآلة بعد الزيادتين' },
    correctInputs: ['519.75'],
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: FB_STD,
  },

  /* -------------------------------------------------------------------
     Screen 18 — deck slide 21 · ValueInputQuestion (הקטנה ואחריה הגדלה)
     🚩 DECK ERROR: the slide's answer box reads 519.75 — that is slide 20's
     answer, copy-pasted. This scenario is 5,000 x 0.8 = 4,000 -> x 1.3 = 5,200.
     Built as 5,200 (both `5200` and `5,200` accepted). Needs a producer ruling.
     ------------------------------------------------------------------- */
  {
    screen: 18, label: '', type: 'value-input', maxAttempts: 2,
    prev: 16, next: 16,
    stem: `<h1 class="q-title q-title--navy">النقصان ثم الزيادة</h1>
      <p>مساحة حديقة ألعاب هي 5,000 م².<br><strong>قلّصت</strong> البلدية مساحة الحديقة بنسبة 20%.<br>وفي السنة التالية، قررت البلدية <strong>زيادتها</strong> بنسبة 30%.</p>
      <p><strong>استعينوا بالتطبيق واحسبوا:</strong><br><strong>ما مساحة الحديقة (الكل النهائي)</strong><br><strong>بعد التغييرين؟</strong></p>`,
    valueBox: { unit: 'م²', label: 'مساحة الحديقة بعد التغييرين' },
    correctInputs: ['5200'], altInputs: [['5,200']],
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: FB_STD,
  },

  /* -------------------------------------------------------------------
     Screen 20 — deck slide 23 · SingleChoiceQuestionImage
     200 x 1.1 = 220; 220 x 0.9 = 198 < 200 -> option 3.
     Deck v5 (22.10.26): options 2/3 now say "מחיר הכדורעף" (Sharon's comment).
     FLAG-PRODUCER: the note asks for `הפקה בגלילה`; built two-column instead,
     because a normal slide never scrolls in this project.
     ------------------------------------------------------------------- */
  {
    screen: 20, label: '', type: 'single', maxAttempts: 2,
    prev: 16,   /* second half is screen 21; next stays 21 */
    stem: `<h1 class="q-title q-title--navy">الزيادة ثم النقصان</h1>
      <p>ادّخرت دانية مالًا لشراء كرة طائرة بسعر 200 شيكل.<br>وعندما وصلت إلى المتجر، اكتشفت أن السعر ارتفع بنسبة 10%.</p>
      <p>"لحسن الحظ، لدى دانية خصم النادي بنسبة 10%، لذا سيعود السعر النهائي بعد الخصم<br>إلى 200 ₪ بالضبط."</p>
      <p><strong>هل الجملة صحيحة؟</strong></p>`,
    options: [
      { id: 'a', html: 'نعم. زيادة السعر بنسبة 10% ثم تخفيضه بنسبة 10% تعيدانه إلى السعر الأصلي' },
      { id: 'b', html: 'لا، سيكون سعر الكرة الطائرة أعلى من 200 شيكل' },
      { id: 'c', html: 'لا، سيكون سعر الكرة الطائرة أقل من 200 شيكل' },
      { id: 'd', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'c',
    content: `<img class="content-img" src="assets/img/volleyball-shop.png" alt="فتاة تختار كرة طائرة في متجر رياضي، بجانب لافتة السعر: كرة طائرة - 220 ₪">`,
    fb: FB_STD,
  },

  /* -------------------------------------------------------------------
     Screen 21 — deck slide 24 · ValueInputQuestion (הגדלה ואחריה הקטנה)
     200 x 1.1 = 220; 220 x 0.9 = 198
     ------------------------------------------------------------------- */
  {
    screen: 21, label: '', type: 'value-input', maxAttempts: 2,
    next: 16,
    stem: `<h1 class="q-title q-title--navy">الزيادة ثم النقصان</h1>
      <p>ادّخرت دانية مالًا لشراء كرة طائرة بـ200 شيكل.<br>وعندما وصلت إلى المتجر، اكتشفت أن السعر ارتفع بنسبة 10%.</p>
      <p>"لحسن الحظ، لدى دانية خصم النادي بنسبة 10%، لذا سيعود السعر النهائي بعد الخصم<br>إلى 200 ₪ بالضبط."</p>
      <p><strong>استعينوا بالتطبيق واحسبوا السعر النهائي الذي دفعته دانية مقابل</strong><br><strong>الكرة الطائرة.</strong></p>`,
    valueBox: { unit: 'شيكل', label: 'السعر النهائي الذي دفعته دانية' },
    correctInputs: ['198'],
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: FB_STD,
  },

  /* -------------------------------------------------------------------
     Screen 23 — deck slide 27 · ValueInputQuestion · שאלה 1 מתוך 4
     Notes: hint after the first wrong attempt, 2 attempts, digits only.
     Answer 1,380 (1,500 x 1.15 = 1,725; 1,725 x 0.8 = 1,380).
     ------------------------------------------------------------------- */
  {
    screen: 23, type: 'value-input', maxAttempts: 2, step: p2step(1),
    hintPolicy: 'after-wrong',
    hint: { body: `ما عدد المتبرعات والمتبرعين بعد الزيادة بنسبة 15%؟<br>هذا هو "الكل الجديد"، ومنه عليكم حساب الزيادة في الأسبوع الثالث.` },
    stem: `<p>في حملة لجمع التبرعات لجمعية تساعد الحيوانات، تبرّع 1,500 شخص في الأسبوع الأول.<br>في الأسبوع الثاني، ازداد عدد المتبرعات والمتبرعين بنسبة 15%.<br>وفي الأسبوع الثالث، انخفض عدد المتبرعين والمتبرعات بنسبة 20%.</p>
      <p>استعينوا بالتطبيق وأكملوا:</p>
      <p><strong>كم بلغ عدد المتبرعات والمتبرعين في نهاية الأسبوع الثالث؟</strong></p>`,
    valueBox: { unit: 'المتبرعات والمتبرعون', label: 'عدد المتبرعات والمتبرعين في نهاية الأسبوع الثالث' },
    correctInputs: ['1380'], altInputs: [['1,380']],
    /* QA 14.10.26: the charity-ad picture is removed so the applet gets the
       whole column and fits without scrolling */
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'إجابة رائعة!', body: S27_TABLE },
      wrong:   { title: FB_WRONG_TITLE, body: S27_TABLE },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 24 — deck slides 28 + 29 · שאלה 2 מתוך 4 (merged pair)
     Answer = statement 2. Verified three ways: the green radio's geometry,
     the rendered page, and the feedback's own "الاستنتاج: العبارة 2 صحيحة."
     FLAG-PRODUCER: slide 29 carries a hint POPUP but neither page has an
     `אפשר רמז?` button. Wired with the component's stated policy (hint after
     the first wrong attempt, 2 attempts) so the written hint is reachable.
     ------------------------------------------------------------------- */
  {
    /* QA 02.11.26: deck 28-34 are ONE scroll screen (dslide 24). This is deck
       29's block; deck 28's data + picture is the static section above it. */
    screen: 24, embedIn: 24, type: 'single', maxAttempts: 2, step: p2step(2),
    hintPolicy: 'after-wrong',
    /* QA 02.11.26: the three principles spelled out (producer text; the pasted
       "תמיד 2. נעבוד" read as items 1 and 2 run together - split back) */
    hint: { body: `تذكّروا المبادئ الثلاثة:<br>1. عند إجراء نقصانين متتاليين، أو زيادتين متتاليتين، أو نقصان ثم زيادة، أو زيادة ثم نقصان، نعمل دائمًا على مرحلتين.<br>2. تُجرى كل عملية على "الكل الجديد" الناتج عن العملية السابقة.<br>3. لا نجمع أبدًا نسب النقصان أو الزيادة ونحسبها من الكل الأصلي، فهذا خطأ!` },
    stem: `<p class="q24-ask">بناءً على المعطيات، اختاروا العبارة الصحيحة:</p>`,
    options: [
      { id: 'a', html: 'الادّعاء صحيح. 15% = 5% + 5% + 5%، ولذلك يزداد مبلغ الادّخار بنسبة 15%.' },
      { id: 'b', html: 'الادّعاء غير صحيح. في كل سنة، يُحسب الربح بنسبة 5% من مبلغ السنة السابقة، ولذلك يزداد مبلغ الادّخار في النهاية بأكثر من 15%.' },
      { id: 'c', html: 'الادّعاء صحيح. في كل سنة نحسب كم هي 5% من المبلغ الابتدائي - 500 ₪، لذلك فالحساب هو 15% من المبلغ الابتدائي.' },
      { id: 'd', html: 'الادّعاء غير صحيح. في كل سنة، يُحسب الربح بنسبة 5% من مبلغ السنة السابقة، وهو أصغر، ولذلك ينخفض مبلغ الادّخار في النهاية بنسبة 15%.' },
    ],
    correct: 'b',
    fb: {
      correct: { title: 'صحيح جدًا.', body: S29_BODY },
      /* QA 14.10.26: this screen's red title */
      wrong:   { title: 'إجابة غير صحيحة، والإجابة الصحيحة معروضة.', body: S29_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 25 — deck slides 30 + 31 · שאלה 3 מתוך 4 (merged pair)
     Note: `נסיון מענה אחד` — ONE attempt. With a single attempt an
     after-wrong hint could never appear, so the written hint is offered from
     the start. Applet runs in its 3-step mode: the deck's yellow production
     note on both pages reads "הפקה – שימו לב היישומון משתנה".
     ------------------------------------------------------------------- */
  {
    /* QA 02.11.26: deck 31's block in the dslide 24 scroll; deck 30's data is
       the static section above it */
    screen: 25, embedIn: 25, type: 'single', maxAttempts: 1, step: p2step(3),
    hint: { body: `أدخلوا البيانات في التطبيق للحالتين الموصوفتين في السؤال، وتحققوا من الكل النهائي.` },
    stem: `<p class="q25-ask"><strong>استعينوا بالتطبيق، أدخلوا البيانات وأجيبوا:</strong></p>
      <p><strong>هل الادّعاء التالي صحيح؟</strong><br>بلغ المبلغ في نهاية السنة الثالثة 500 ₪.</p>`,
    options: [
      { id: 'a', html: 'صحيح' },
      { id: 'b', html: 'غير صحيح' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'b',
    content: appletEmbed('assets/applets/two-step-percent.html?steps=3', 'تطبيق: ثلاث مراحل جديدة'),
    fb: {
      correct: { title: 'صحيح جدًا!', body: S30_BODY },
      /* QA 14.10.26: the deck's own red title — the standard two-line title
         repeated "בואו…" right above the body's "لنتحقق من الادعاء:" */
      wrong:   { title: 'الإجابة غير صحيحة.', body: S30_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 27 — deck slide 34 · Dropdown · שאלה 4ב מתוך 4
     Key from `a:highlight 00FF00`: היקף -> גדל, שטח -> קטן. Cross-checked
     against slide 33's arithmetic (8a -> 9.6a grows; 3a² -> 2.52a² shrinks).
     RTL: the FIRST blank in the sentence is the rightmost, i.e. היקף המלבן.
     ------------------------------------------------------------------- */
  {
    /* QA 02.11.26: deck 34's block in the dslide 24 scroll - a pseudo number
       (127) since 24-27 now hold the scroll's other questions */
    screen: 127, embedIn: 26, type: 'dropdown', maxAttempts: 2, step: p2step(4),
    /* QA 02.11.26: "יש להציג את נתוני הטבלה הקודמת לשם ההשוואה הזו" - the
       completed table from deck 33 sits above the sentence */
    stem: `${DT_TABLE_DONE}<p>ب. <strong>نتيجةً للتغيير:</strong></p>`,
    sentence: ['<span class="dd-lead">محيط المستطيل</span> ', ' <span class="dd-lead">ومساحة المستطيل</span> ', ''],
    blanks: [
      { pool: ['يزداد', 'ينقص', 'يبقى دون تغيير'], correct: 'يزداد' },
      { pool: ['يزداد', 'ينقص', 'يبقى دون تغيير'], correct: 'ينقص' },
    ],
    fb: {
      correct: { title: 'صحيح جدًا.', body: `
        <p>نتيجةً للتغيير: يزداد محيط المستطيل وتقلّ مساحته.</p>
        <p>لم يبقَ المحيط والمساحة كما هما، رغم أننا زدنا الطول وقلّلنا العرض بالنسبة المئوية نفسها.</p>` },
      wrong: { title: FB_WRONG_TITLE, body: `
        <p>نتيجةً للتغيير: يزداد محيط المستطيل وتقلّ مساحته.</p>
        <p>لم يبقَ المحيط والمساحة كما هما، رغم أننا زدنا الطول وقلّلنا العرض بالنسبة المئوية نفسها.</p>` },
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      retryPartial: 'الإجابة صحيحة جزئيًا، حاولوا مرة أخرى!',   /* QA 18.10.26 (2.3) */
    },
  },

  /* -------------------------------------------------------------------
     Screen 29 — deck slide 37 · SingleChoiceQuestion · שאלה 1א מתוך 3
     40 x 0.9 x 0.9 = 32.4, not 32 — Roy is wrong, so the answer is `لا`.
     ------------------------------------------------------------------- */
  {
    screen: 29, type: 'single', maxAttempts: 2, step: p3step(1),
    /* producer 08.09: on THIS slide the hint is offered from the start
       (default policy). Every other question in the component keeps the
       deck's "רמז זמין אחרי ניסיון מענה שגוי ראשון". */
    hint: { body: `في شهر فبراير، نحسب 10% من السعر الناتج بعد التخفيض الأول.<br>اسألوا أنفسكم: <strong>ما الكل الجديد؟</strong>` },
    stem: `<div class="story-lead">
        <p>1. كان سعر تذكرة فيلم في ديسمبر 40 شيكلًا.<br>في يناير، انخفض السعر بنسبة 10%، ثم انخفض مجددًا بنسبة 10% في فبراير.</p>
      </div>
      <p><strong>أ. قال كريم: "10% و10% تساويان 20%، ولذلك انخفض السعر إلى 32 شيكلًا".</strong></p>
      <p><strong>هل كريم محقّ؟</strong></p>`,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'b',
    content: `<img class="content-img" src="assets/img/cinema-posters.png" alt="الشخصية المرافقة تشير إلى ملصقات في دار السينما">`,
    fb: {
      correct: { title: 'الإجابة الصحيحة', body: `
        <p>كريم مخطئ.</p>
        <p>أولًا نحسب السعر بعد التخفيض في يناير، وبعد ذلك فقط نحسب السعر بعد تخفيض فبراير.</p>
        <p>لا نجمع النسب المئوية بأي حال. فكل تخفيض يُحسب من مبلغ مختلف.</p>` },
      wrong: { title: FB_WRONG_TITLE, body: `
        <p>كريم مخطئ.</p>
        <p>أولًا نحسب السعر بعد التخفيض في يناير، وبعد ذلك فقط نحسب السعر بعد تخفيض فبراير.</p>
        <p>لا نجمع النسب المئوية بأي حال. فكل تخفيض يُحسب من مبلغ مختلف.</p>` },
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 30 — deck slide 38 · SingleChoiceQuestion · שאלה 1ב מתוך 3
     Answer 32.4 ש״ח. FLAG-PRODUCER: options 1-2 use ש״ח (U+05F4 gershayim)
     and options 3-4 use ש"ח (ASCII quote) — kept verbatim.
     ------------------------------------------------------------------- */
  {
    screen: 30, type: 'single', maxAttempts: 2, step: p3step(1),
    hintPolicy: 'after-wrong',
    hint: { body: `احسبوا على مرحلتين. انتبهوا إلى الكل الجديد قبل التخفيض في فبراير.` },
    stem: `<div class="story-lead">
        <p>1. كان سعر تذكرة فيلم 40 شيكلًا.<br>في يناير، انخفض السعر بنسبة 10%، ثم انخفض مجددًا بنسبة 10% في فبراير.</p>
      </div>
      <p><strong>ب. ما سعر التذكرة بعد الخصمين؟</strong></p>`,
    options: [
      { id: 'a', html: '32 شيكل' },
      { id: 'b', html: '32.4 شيكل' },
      { id: 'c', html: '36 شيكل' },
      { id: 'd', html: '31.6 شيكل' },
    ],
    correct: 'b',
    content: `<img class="content-img" src="assets/img/cinema-posters.png" alt="الشخصية المرافقة تشير إلى ملصقات في دار السينما">`,
    fb: {
      correct: { title: 'صحيح!', body: S38_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S38_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 31 — deck slide 39 · SingleChoiceQuestion · שאלה 2א מתוך 3
     250 x 1.3 = 325; 325 x 0.7 = 227.5 < 250, so option 1.
     QA 02.11.26: the duplicated `לפני חג הקניות` is gone (producer).
     This slide has no hint popup and no hint button in the deck.
     ------------------------------------------------------------------- */
  {
    screen: 31, type: 'single', maxAttempts: 2, step: p3step(2),
    /* QA 14.10.26: "2." hangs in the margin and every following line — the
       א. lead included — starts on the text line above it (CSS hanging indent,
       not &nbsp; padding); single spaces, a space before Black Friday */
    stem: `<p class="q-hang"><span class="q-num">2.</span>كان سعر بنطلون جينز 250 شيكلًا.<br>قبل عروض الجمعة السوداء (Black Friday)، ارتفع السعر بنسبة 30%.<br>وخلال عروض الجمعة السوداء (Black Friday)، انخفض السعر بنسبة 30%.</p>
      <p class="q-hang-body"><strong>أ. أيّ مما يلي يمكن قوله بالتأكيد؟</strong></p>`,
    options: [
      { id: 'a', html: 'السعر في عروض الجمعة السوداء (Black Friday) أقل من 250 شيكلًا' },
      { id: 'b', html: 'السعر في عروض الجمعة السوداء (Black Friday) هو 250 شيكلًا' },
      { id: 'c', html: 'السعر في عروض الجمعة السوداء (Black Friday) أعلى من 250 شيكلًا' },
    ],
    correct: 'a',
    content: `<img class="content-img" src="assets/img/black-friday-shop.png" alt="واجهة متجر بها لافتات Black Friday">`,
    fb: {
      correct: { title: 'صحيح جدًا!', body: S39_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S39_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 33 — deck slide 41 · SingleChoiceQuestion · שאלה 3א מתוך 3
     Both routes give 103.04, so the answer is "the same price either way".
     ------------------------------------------------------------------- */
  {
    screen: 33, type: 'single', maxAttempts: 2, step: p3step(3),
    hintPolicy: 'after-wrong',
    hint: { body: `لا تتسرّعوا في الوصول إلى استنتاجات، احسبوا كل خيار من الخيارات وتحقّقوا من النتيجة.` },
    /* QA 14.10.26: the meal price + both option cards sit ABOVE the question
       (right column, full width, so each card breaks like dslide 32's); the
       applet takes the whole left column */
    stem: `<p class="pizza-price">سعر الوجبة: 112 ₪</p>
      ${PIZZA_OPTIONS}
      <p class="q33-ask"><strong>أ. استعينوا بالتطبيق واختاروا الإجابة الصحيحة:</strong></p>`,
    options: [
      { id: 'a', html: 'ستدفع راز أقل إذا اختارت الخيار أ' },
      { id: 'b', html: 'ستدفع راز أقل إذا اختارت الخيار ب' },
      { id: 'c', html: 'ستدفع راز السعر نفسه في الخيارين' },
    ],
    correct: 'c',
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'أحسنتم', body: S41_TABLE + `<p>الاستنتاج: ستدفع راز السعر نفسه في الخيارين.</p>` },
      wrong:   { title: FB_WRONG_TITLE, body: S41_TABLE + `<p>الاستنتاج: ستدفع راز السعر نفسه في الخيارين.</p>` },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 34 — deck slide 42 · SingleChoiceQuestion · שאלה 3ב מתוך 3
     ⚠ THE TRAP SLIDE: in the XML the green radio is nested under option 3's
     group, but its centre-y pairs it with option 2 (Δ 1.3px vs 80px), the
     rendered page puts the green dot on `חוק החילוף בכפל`, and the feedback
     says both `מכיוון שכפל היא פעולה חלופית` and `מסקנה: תשובה ב' היא הנכונה`.
     All three agree on option 2. Group nesting is not the key.
     ------------------------------------------------------------------- */
  {
    screen: 34, type: 'single', maxAttempts: 2, step: p3step(3),
    hintPolicy: 'after-wrong',
    hint: { body: `تأمّلوا الحساب وتحقّقوا من العمليات الحسابية التي أجريتموها.` },
    /* QA 02.11.26: the whole question bold, two lines; option 2 and the
       feedback are deck v5's shortened ones */
    stem: `<p><strong>ب. أيّ خاصية رياضية تفسّر ضرورة تساوي النتيجة في طريقتي الحساب،<br>بغضّ النظر عن سعر الوجبة؟</strong></p>`,
    options: [
      { id: 'a', html: 'قانون التوزيع (يتم توزيع الخصم ورسوم التوصيل بالتساوي على سعر الوجبة)' },
      { id: 'b', html: 'قانون التبديل في الضرب (في الضرب، تغيير ترتيب العوامل لا يغيّر الناتج).' },
      { id: 'c', html: 'قانون التجميع (جمع نسبة الخصم (20%) ونسبة رسوم التوصيل (15%) يساوي دائمًا 35%)' },
      { id: 'd', html: 'قانون العنصر المحايد (رسوم التوصيل تلغي الخصم)' },
    ],
    correct: 'b',
    /* QA 14.10.26: the meal price from dslide 33 above the cards */
    content: `<p class="pizza-price">سعر الوجبة: 112 ₪</p>` + PIZZA_OPTIONS,
    fb: {
      correct: { title: 'أحسنتم!', body: S42_BODY },
      wrong:   { title: 'هذا غير دقيق. إليكم الحساب التفصيلي:', body: S42_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 36 — deck slide 44 · SingleChoiceQuestion · שאלה 3ד מתוך 3
     Note: "אין רמז בסעיף זה", "ניסיון מענה אחד", and the character enters
     after the feedback whether it is right or wrong.
     ------------------------------------------------------------------- */
  {
    screen: 36, type: 'single', maxAttempts: 1, step: p3step(3),
    /* QA 14.10.26: sub-question ג's two expressions sit ABOVE the question
       (right column) — the left column belongs to the character that enters
       after the feedback */
    stem: `<div class="opt-card q36-eqs">
        <p>السعر النهائي في الخيار أ:</p>
        <p class="eq-line"><span class="eq-ltr">115% ∙ (80% ∙ x) = 1.15 ∙ (0.8 ∙ x) = 0.92x</span></p>
        <p>السعر النهائي في الخيار ب:</p>
        <p class="eq-line"><span class="eq-ltr">80% ∙ (115% ∙ x) = 0.8 ∙ (1.15 ∙ x) = 0.92x</span></p>
      </div>
      <p class="q36-ask"><strong>د. هل السعر النهائي متساوٍ في الخيارين؟</strong></p>`,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'a',
    /* note: "דמות עולה אחרי המשוב (נכון או טעות)" — hidden until then */
    content: `<div class="character-widget cw-notebook cw-after-fb" hidden>
        <div class="speech-bubble">مممم، هذا مثير للاهتمام،<br>ما القاعدة أو المبدأ الذي ترسّخ لديك بعد الحل؟</div>
        <img src="assets/img/character-1-notebook.png" alt="الشخصية المرافقة تكتب في الدفتر">
      </div>`,
    fb: {
      correct: { title: 'صحيح جدًا!', body: `<p>وفقًا للتمثيل الجبري، يُستنتج أن السعر متساوٍ في الخيارين، بغض النظر عن سعر الوجبة (<span class="eq-ltr">x</span>).</p>` },
      wrong:   { title: FB_WRONG_TITLE, body: `<p>وفقًا للتمثيل الجبري، يُستنتج أن السعر متساوٍ في الخيارين، بغض النظر عن سعر الوجبة (<span class="eq-ltr">x</span>).</p>` },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screens 38-40 — deck slides 46, 47, 48 · the 07-03 tail (מועד ב)
     Notes: "סטנדרטי ב – שאלה 1א/ב/ג מתוך 1. אין צורך בציר התקדמות" — no
     progress strip on these, so no q.step.
     FLAG-PRODUCER: slide 45's own copy says "3 שאלות מתוך 4" and note-41 asks
     for a 2-station strip, while these three slides each say no strip is
     needed. Built per the per-slide notes.
     ------------------------------------------------------------------- */
  {
    /* slide 46 — 81 is what % of 300? -> 27. The deck has the hint BUTTON but
       no hint content; slide 47 has the content but no button. Flagged. */
    screen: 38, label: '', type: 'value-input', maxAttempts: 2, step: p3bstep(1),
    hintPolicy: 'after-wrong',
    hint: { body: `هذه حالة حساب نسبة مئوية من الكل. ضعوا في جدول التناسب: ما النسبة المئوية التي تساوي 81MB من 300MB؟` },
    stem: `<p>حرّرت ندى مقطع فيديو لمشروع صفّي.<br>حجم ملف الفيديو هو <span class="eq-ltr">300MB</span>.<br>تشغل المؤثرات <span class="eq-ltr">81MB</span> من الملف.</p>
      <p><strong>أ. ما النسبة المئوية من ملف الفيديو التي تشغلها المؤثرات؟</strong><br><strong>(يمكنكم الاستعانة بجدول التناسب)</strong></p>
      <p>اكتبوا الإجابة:</p>`,
    valueBox: { unit: '%', unitSide: 'right', label: 'النسبة المئوية من ملف الفيديو' },
    correctInputs: ['27'],
    content: `<div class="character-widget cw-monster">
        <div class="speech-bubble">لقد تعلّمنا حساب النسب المئوية منذ زمن...</div>
        <img src="assets/img/character-1-reading.png" alt="شخصية مرافقة">
      </div>`,
    fb: {
      correct: { title: 'صحيح!', body: S46_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S46_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },
  {
    /* slide 47 — 81 x 0.88 x 0.85 = 60.588; the note also accepts 60.58.
       FLAG-PRODUCER: this slide has NO wrong-answer feedback in the deck —
       the template's own title is used. */
    screen: 39, label: '', type: 'value-input', maxAttempts: 2, step: p3bstep(2),
    hintPolicy: 'after-wrong',
    hint: { body: `هذه حالة نقصانين متتاليين. احسبوا خطوة بخطوة: ما الحجم الذي تشغله المؤثرات بعد تخفيض بنسبة 12%؟ ثم احسبوا الحجم الذي تشغله بعد تخفيض إضافي بنسبة 15% من الكل الجديد.` },
    /* QA 02.11.26: "להזכיר מהו השלם" - the whole is restated first;
       QA 03.11.26 (Elad): the line is just "האפקטים תופסים 81MB." */
    stem: `<p>تشغل المؤثرات <span class="eq-ltr">81MB</span>.</p>
      <p><strong>ب. </strong>لتقليل حجم الملف، أجرت ندى عملية ضغط خفّضت حجم<br>المؤثرات بنسبة 12%، ثم بنسبة 15% إضافية.</p>
      <p><strong>استعينوا بالتطبيق، كم <span class="eq-ltr">MB</span> تشغل المؤثرات بعد عمليتي الضغط؟</strong></p>
      <p>اكتبوا الإجابة:</p>`,
    valueBox: { unit: 'MB', label: 'حجم المؤثرات بعد عمليتي الضغط' },
    correctInputs: ['60.588'], altInputs: [['60.58']],
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'صحيح!', body: S47_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S47_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },
  {
    /* slide 48 — (81 − 60.588) / 81 = 25.2% */
    screen: 40, label: '', type: 'single', maxAttempts: 2, step: p3bstep(3),
    stem: `<p><strong>ج. </strong>في البداية، كانت المؤثرات تشغل <span class="eq-ltr">81MB</span>.<br>وبعد عمليتي الضغط، أصبحت تشغل <span class="eq-ltr">60.588MB</span>.</p>
      <p><strong>ما النسبة المئوية الإجمالية لانخفاض حجمها؟</strong><br>(يمكنكم الاستعانة بجدول التناسب)</p>`,
    options: [
      { id: 'a', html: '27%' },
      { id: 'b', html: '37%' },
      { id: 'c', html: '23.8%' },
      { id: 'd', html: '25.2%' },
    ],
    correct: 'd',
    content: `<div class="character-widget cw-monster">
        <div class="speech-bubble">نعرف كيف نحسب النسب المئوية منذ زمن طويل</div>
        <img src="assets/img/character-1-reading.png" alt="شخصية مرافقة">
      </div>`,
    fb: {
      correct: { title: 'أحسنتم، تذكّرتم جيدًا!', body: S48_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S48_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* -------------------------------------------------------------------
     Screen 43 — deck slide 52 · ValueInputQuestion "יחד עם singlechoice"
     Note: "רק אחרי סימון כן/לא, הדמות והטיפ מופיעים וכפתור המשך זמין."
     There is NO answer key here — it is the learner's own measurement from
     the physical task, so both radios are unfilled in the deck. Built as a
     custom question with no verdict: marking yes/no reveals the tip and
     releases the bar.
     ------------------------------------------------------------------- */

  /* ── Screen 46 · deck slide 56 · שאלה 1 מתוך 4 ──────────────────────
     240×1.3×0.7 = 218.4 and 240×0.7×1.3 = 218.4 — the prices end up equal.
     FLAG-PRODUCER: the bar has an `אפשר רמז?` button with no hint authored
     anywhere on the slide; a hint written from the slide's own maths is used. */
  {
    screen: 46, label: '', type: 'single', maxAttempts: 2, step: p5step(1),
    hintPolicy: 'after-wrong',
    hint: { body: `كل تغيير يُحسب انطلاقًا من الكل الذي قبله. احسبوا كل منتج على مرحلتين وقارنوا النتائج.` },
    stem: `<p>سعر كلٍّ من المنتجين أ وب هو 240 ₪.<br>المنتج أ: ارتفع سعره بنسبة 30% ثم انخفض بنسبة 30%.<br>المنتج ب: انخفض سعره بنسبة 30% ثم ارتفع بنسبة 30%.</p>
      <p><strong>اختاروا الادّعاء الصحيح – بعد التغييرين:</strong><br><strong>(يمكنكم الاستعانة بالتطبيق)</strong></p>`,
    options: [
      { id: 'a', html: 'سعر المنتجين متساوٍ.' },
      { id: 'b', html: 'المنتج أ أغلى.' },
      { id: 'c', html: 'المنتج ب أغلى.' },
    ],
    correct: 'a',
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'صحيح، السعر متطابق!', body: S56_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S56_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 48 · deck slide 58 · שאלה 2 מתוך 4 ──────────────────────
     Route א: 8000×0.75 = 6,000 then ×1.1 = 6,600. Route ב: 8000×0.85 = 6,800.
     So route א ends lower. No hint button on this slide in the deck. */
  {
    screen: 48, label: '', type: 'single', maxAttempts: 2, step: p5step(2),
    stem: `${ROUTES_TABLE(true)}
      <p class="q48-ask"><strong>بعد أسبوعين، في أيّ مسار سيكون عدد الخطوات المحدّد (الهدف) أقل؟</strong><br>(يمكنكم الاستعانة بالتطبيق)</p>`,
    options: [
      { id: 'a', html: "في المسار أ" },
      { id: 'b', html: "في المسار ب" },
      { id: 'c', html: 'في المسارين يكون عدد الخطوات متساويًا' },
      { id: 'd', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'a',
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'أحسنتم!', body: S58_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S58_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 49 · deck slide 59 · שאלה 3א מתוך 4 ─────────────────────
     a → ×1.4 → ×1.25 = 1.75a. The `a` is static; the learner types 1.75.
     Render confirms the box sits LEFT of the `a`, forming the LTR atom
     `1.75a` — so the unit is the FIRST child (rightmost) in the RTL row. */
  {
    screen: 49, label: '', type: 'value-input', maxAttempts: 2, step: p5step(3),
    stem: `<p>لاحظ سامر أنه يشرب ماءً أقل مما ينبغي: <span class="eq-ltr">a</span> كوبًا فقط في اليوم (<span class="eq-ltr">a &lt; 5</span>).<br>فقرّر زيادة كمية الماء التي يشربها يوميًا بالتدريج.<br>في الأسبوع الأول، زاد عدد الأكواب التي يشربها بنسبة 40%.<br>وفي الأسبوع الثاني، زاد كمية الماء بنسبة 25% إضافية.</p>
      <p><strong>أ. عبّروا بدلالة <span class="eq-ltr">a</span> عن عدد أكواب الماء التي سيشربها سامر</strong><br><strong>يوميًا بعد الزيادتين:</strong></p>`,
    /* QA 14.10.26: the answer box sits inside its sentence, as the deck has it */
    valueBox: { before: 'بعد الزيادتين، سيشرب سامر <span class="eq-ltr">a</span>', after: 'أكواب ماء.',
                label: 'معامل عدد الأكواب' },
    correctInputs: ['1.75'],
    content: `<img class="content-img" src="assets/img/or-drinking.jpg" alt="شاب يشرب كوبًا من الماء">`,
    fb: {
      correct: { title: 'صحيح!', body: S59_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S59_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 50 · deck slide 60 · שאלה 3ב מתוך 4 ─────────────────────
     0.75a out of a = 75%. This is the ONE slide in the section with an
     authored hint. Note also: "המשוב ארוך, לאפשר גלילה". */
  {
    screen: 50, label: '', type: 'value-input', maxAttempts: 2, step: p5step(3),
    hintPolicy: 'after-wrong',
    hint: { body: `استعينوا بجدول التناسب.` },
    stem: `<p>بعد الزيادتين، يشرب سامر <span class="eq-ltr">1.75a</span> كوبًا من الماء يوميًا.</p>
      <p><strong>ب. بكم في المئة زاد عدد أكواب الماء التي يشربها سامر يوميًا؟</strong></p>
      <p>اكتبوا الإجابة:</p>`,
    valueBox: { unit: '%', unitSide: 'right', label: 'نسبة الزيادة' },
    correctInputs: ['75'],
    content: `<img class="content-img" src="assets/img/or-drinking-2.jpg" alt="شاب يشرب الماء من زجاجة">`,
    fb: {
      correct: { title: 'صحيح جدًا 🙂', body: S60_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S60_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 51 · deck slide 61 · שאלה 4א מתוך 4 ─────────────────────
     🚩 The note says SingleChoiceQuestion, but the stem says
     `סמנו את כל הביטויים הנכונים` and THREE options carry the green key.
     Built as multi-select — the deck's content wins over the note. Confirm.
     All three keyed options equal 1.21k; the three distractors equal 0.99k.
     Option order is the deck's visual order: row 1 right→left, then row 2. */
  {
    screen: 51, label: '', type: 'multi', maxAttempts: 2, step: p5step(4),
    stem: `<p>عملت سلمى في العطلة، وحُدّد أجرها بـ<span class="eq-ltr">k</span> شيكلًا للساعة.<br>بعد شهر، زاد أجرها بالساعة بنسبة 10%.<br>وفي الشهر التالي، زاد أجرها مجددًا بنسبة 10% إضافية.</p>
      <p><strong>أ. ما التعبيرات التي تمثّل أجر سلمى بالساعة في الشهر الثاني؟</strong><br><strong>حدّدوا جميع التعبيرات الصحيحة.</strong></p>`,
    options: [
      { id: 'r1a', html: '<span class="eq-ltr">1.1 ∙ 0.9k</span>' },
      { id: 'r1b', html: '<span class="eq-ltr">1.1 ∙ 1.1k</span>' },
      { id: 'r1c', html: '<span class="eq-ltr">0.9 ∙ 1.1k</span>' },
      { id: 'r2a', html: '<span class="eq-ltr">1.21k</span>' },
      { id: 'r2b', html: '<span class="eq-ltr">0.99k</span>' },
      { id: 'r2c', html: '<span class="eq-ltr">1.1K ∙ 1.1</span>' },
    ],
    correctSet: ['r1b', 'r2a', 'r2c'],
    /* deck: character at x=46 (bottom-left), bubble centre at x=427 — the
       bubble sits to its RIGHT, so it takes the side tail (which points left,
       into the character) and the widget lays out as a row. */
    content: `<div class="character-widget cw-monster cw-monster--right">
        <div class="speech-bubble side-bubble">برافو لسلمى على العمل الممتاز!</div>
        <img src="assets/img/character-1-hands-up.png" alt="شخصية مرافقة">
      </div>`,
    fb: {
      correct: { title: 'رائع! إجابة دقيقة وكاملة.', body: S61_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S61_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      retryPartial: 'الإجابة صحيحة جزئيًا، حاولوا مرة أخرى!',   /* QA 18.10.26 (2.3) */
    },
  },

  /* ── Screen 52 · deck slide 62 · שאלה 4ב מתוך 4 ─────────────────────
     k = 25 -> 1.21k = 30.25. Deck writes `25₪` in the stem and `25 ₪` in the
     feedback; kept verbatim. The unit word sits LEFT of the box (opposite to
     slide 60's `%`), which is the project's rule for word units. */
  {
    screen: 52, label: '', type: 'value-input', maxAttempts: 2, step: p5step(4),
    /* 🚩 the deck's stem writes `25₪` with NO space, which makes the digits and
       the shekel one token and renders ₪ to the RIGHT of the number — against
       the unit-side rule everywhere else in the unit, and against this slide's
       OWN feedback, which writes `25 ₪`. The space is restored; flagged. */
    stem: `<p>ب. إذا كان أجر سلمى الابتدائي 25 ₪ للساعة،<br>فما أجرها بالساعة بعد شهرين من العمل؟</p>`,
    valueBox: { unit: 'شيكل للساعة', label: 'الأجر بالساعة بعد شهرين' },
    correctInputs: ['30.25'],
    content: `<img class="content-img" src="assets/img/shiran-working.jpg" alt="سلمى في العمل">`,
    fb: {
      correct: { title: 'برافو، الإجابة صحيحة', body: S62_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S62_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 55 · deck slide 66 · שאלת שיא סעיף א׳ · answer 150 ──────
     QA 02.11.26 (גורף, component 06): the peak question carries NO stepper. */
  {
    screen: 55, label: '', type: 'value-input', maxAttempts: 2,
    hintPolicy: 'after-wrong',
    hint: { body: `السعر الأصلي لكل حقيبة مدرسية هو 200 شيكل.` },
    stem: `<p>أ. يقدّم المتجر الأول عرضًا لشراء حقيبتين:<br>اشتروا حقيبة مدرسية واحدة بالسعر الكامل، واحصلوا على الثانية بخصم 50%.</p>
      <p>إذا اشترت ندى ويوسف حقيبتين مدرسيتين معًا وتقاسما التكلفة الإجمالية بالتساوي،<br><strong>فكم سيدفعان مقابل كل حقيبة؟</strong></p>
      <p>اكتبوا الإجابة:</p>`,
    valueBox: { unit: 'شيكل', label: 'سعر كل حقيبة مدرسية' },
    correctInputs: ['150'],
    content: `<div class="stacked-media">
        <img class="content-img content-img--crop" data-no-zoom src="assets/img/shop-a-offer.jpg" alt="لافتة العرض في متجر أ">
        <img class="content-img" data-no-zoom src="assets/img/yellow-schoolbag.jpg" alt="حقيبة صفراء بعلامة سعر">
      </div>`,
    fb: {
      correct: { title: 'صحيح جدًا', body: S66_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S66_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 57 · deck slide 68 · סעיף ב׳ · 200×0.75×0.75 = 112.5 ──── */
  {
    screen: 57, label: '', type: 'value-input', maxAttempts: 2,
    stem: `<p>ب. في المتجر ب، يوجد خصم بنسبة 25% على كل حقيبة مدرسية،<br>وخصم إضافي بنسبة 25% لعضوات النادي وأعضائه.</p>
      <p>لدى يوسف بطاقة عضوية، وهو يتحقّق من سعر حقيبة مدرسية واحدة.</p>
      <p class="q57-ask"><strong>كم سيبلغ سعر حقيبة يوسف المدرسية؟</strong><br>(يمكنكم الاستعانة بالتطبيق)</p>
      <p>اكتبوا الإجابة:</p>`,
    valueBox: { unit: 'شيكل', label: 'سعر حقيبة يوسف المدرسية' },
    correctInputs: ['112.5'],
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'إجابة رائعة!', body: S68_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S68_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 58 · deck slide 69 · סעיף ג׳ · 200×0.7×0.8 = 112 ───────
     FLAG-PRODUCER: this slide has NO wrong-answer feedback in the deck (the
     only such gap in the range) — the approved title is used instead. */
  {
    screen: 58, label: '', type: 'value-input', maxAttempts: 2,
    stem: `<p>ج. يقدّم المتجر ج عرضين يمكن الجمع بينهما:<br>خصم 30% على الحقيبة التي اختارتها ندى، وخصم إضافي بنسبة 20% على جميع منتجات المتجر.</p>
      <p>تتحقّق ندى من سعر الحقيبة المدرسية في هذا المتجر.</p>
      <p><strong>كم سيبلغ سعر الحقيبة المدرسية في المتجر ج؟</strong><br>(يمكنكم الاستعانة بالتطبيق)</p>
      <p>اكتبوا الإجابة:</p>`,
    valueBox: { unit: 'شيكل', label: 'سعر الحقيبة المدرسية في المتجر ج' },
    correctInputs: ['112'],
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'إجابة رائعة!', body: S69_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S69_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 60 · deck slide 71 · סעיף ד׳ · one attempt ─────────────
     FLAG-PRODUCER: this slide says shop ב׳ is 25% + 15% while slide 68 says
     25% + 25% for the same shop. Kept verbatim. */
  {
    screen: 60, label: '', type: 'single', maxAttempts: 1,
    finishLabel: 'انتهيت',   /* QA 18.10.26: last question of the שאלת שיא */
    stem: `<p>د. في متجر ب عرض: خصم 25% على كل حقيبة مدرسية وخصم إضافي بنسبة 15% لأعضاء النادي.</p>
      <p>يوضّح أمين الصندوق أن عليه، وفقًا للإجراءات، تطبيق خصم العضوية أولًا،<br>ثم تطبيق الخصم على الحقيبة المدرسية.</p>
      <p><strong>هل سيتغيّر سعر الحقيبة إذا غيّرنا الترتيب؟</strong><br> (يمكنكم الاستعانة بالتطبيق)</p>`,
    options: [{ id: 'a', html: 'نعم' }, { id: 'b', html: 'لا' }],
    correct: 'b',
    content: appletEmbed('assets/applets/two-step-percent.html', 'تطبيق: مرحلتان جديدتان'),
    fb: {
      correct: { title: 'كلامك صحيح.', body: S71_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S71_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 63 · deck slide 75 · מועד ב׳ סעיף א׳ · 120×0.5×0.7 = 42 ── */
  {
    screen: 63, label: '', type: 'single', maxAttempts: 2,
    stem: `<p>أ. في بداية الصيف، كان حجم المياه في الخزان ${termTip('<strong>120 ألف متر مكعب</strong>.', 'المتر المكعب وحدة لقياس الحجم.')}<br>في شهر يوليو، أدّت موجة حرّ إلى انخفاض حجم المياه بنسبة 50%.<br>وفي شهر أغسطس، سُحبت مياه من الخزان، فانخفض حجمها بنسبة 30% إضافية.</p>
      <p class="q-ask-gap"><strong>كم ألف متر مكعب من المياه بقي في الخزان في نهاية الصيف؟</strong></p>`,
    options: [
      { id: 'a', html: '40 ألف متر مكعب' },
      { id: 'b', html: '42 ألف متر مكعب' },
      { id: 'c', html: '45 ألف متر مكعب' },
      { id: 'd', html: '50 ألف متر مكعب' },
    ],
    correct: 'b',
    fb: {
      correct: { title: 'صحيح جدًا', body: S75_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S75_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 64 · deck slide 76 · סעיף ב׳ · (120−42)/120 = 65% ──────
     Note: "המשוב ארוך, לאפשר גלילה". */
  {
    screen: 64, label: '', type: 'single', maxAttempts: 2,
    hintPolicy: 'after-wrong',
    hint: { body: `ابحثوا عن مقدار الانخفاض في حجم الماء بآلاف الأمتار المكعبة، وضعوه في جدول التناسب لإيجاد النسبة المئوية التي يشكّلها من الكل.` },
    stem: `<p>ب. في بداية الصيف، كان في الخزان 120 ألف متر مكعب من المياه.<br>وفي نهاية الصيف، بقي فيه 42 ألف متر مكعب.</p>
      <p class="q-ask-gap"><strong>ما النسبة المئوية الإجمالية لانخفاض حجم المياه في الخزان مقارنةً ببداية الصيف؟</strong></p>`,
    options: [
      { id: 'a', html: '35%' }, { id: 'b', html: '50%' },
      { id: 'c', html: '65%' }, { id: 'd', html: '70%' },
    ],
    correct: 'c',
    fb: {
      correct: { title: 'رائع جدًا.', body: S76_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S76_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },

  /* ── Screen 65 · deck slide 77 · סעיף ג׳ · answer = option 2 ───────
     Option 2 is two authored paragraphs in the deck — one of only two
     `<a:br/>` in the whole range; the break is reproduced. */
  {
    screen: 65, label: '', type: 'single', maxAttempts: 2,
    finishLabel: 'انتهيت',   /* QA 18.10.26: last question of the שאלת שיא */
    stem: `<p><strong>ج. أيّ ادّعاء يفسّر النتيجة؟</strong></p>`,
    options: [
      { id: 'a', html: 'الانخفاض الكلي هو 80%، لأننا نجمع 50% و30%.' },
      { id: 'b', html: 'الانخفاض الكلي هو 65%، لأن نسبة 30% في الانخفاض الثاني<br>حُسبت من الكمية المتبقية بعد الانخفاض الأول.' },
      { id: 'c', html: 'الانخفاض الكلي هو 40%، لأن هذا هو متوسط 50% و30%.' },
      { id: 'd', html: 'الانخفاض الكلي أكبر من 80%، لأنّ هناك انخفاضين متتاليين.' },
    ],
    correct: 'b',
    fb: {
      correct: { title: 'رائع جدًا!', body: S77_BODY },
      wrong:   { title: FB_WRONG_TITLE, body: S77_BODY },
      retry:   'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
    },
  },
];
